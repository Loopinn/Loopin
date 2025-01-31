<script setup>
import supabase from "@/config/supabase";
import { debounce } from "lodash";
import { computed, onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commetStore";
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";
import { useRouter } from "vue-router";

import ConfirmModal from "../modal/ConfirmModal.vue";
import like from "../../assets/images/likeblack_full.svg";
import unlike from "../../assets/images/likeblack.svg";
import userProfile from "@/assets/images/no-profile.svg";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const inputText = ref("");
const editingCommentId = ref(null);
const editedContent = ref("");
const isModalOpen = ref(false);
const id = ref(null);
const profile = ref(null);
const likes = ref([]);
const userInfo = ref([]);

const router = useRouter();
const authStore = useAuthStore();
const commentStore = useCommentStore();
const postStore = usePostStore();
const { loginUser } = authStore;
const { loungeComments } = storeToRefs(commentStore);
const { loungePosts } = storeToRefs(postStore);
const {
  loadLoungeComments,
  createLoungeComment,
  deleteLoungeComment,
  updateLoungeComment,
  loungeCommentLike,
  loungeCommentUnLike,
} = commentStore;
const comments = computed(() => loungeComments.value.filter((comment) => comment.post_id === props.postId) || []);

const currentPost = computed(() => {
  return loungePosts.value.find((post) => post.id === props.postId);
});

const handleLike = debounce(async (commentId) => {
  const userIdValue = await getUserId();
  if (userIdValue) {
    const post = loungeComments.value.find((post) => post.id === commentId);
    const like = likes.value.find((data) => data.id === commentId);
    if (like.isLiked) {
      await loungeCommentUnLike(post, userIdValue);
    } else {
      await loungeCommentLike(post, userIdValue);
    }
    likes.value = likes.value.map((like) => (like.id === commentId ? { ...like, isLiked: !like.isLiked } : like));
    await loadLoungeComments(props.postId);
  } else {
    isModalOpen.value = true;
  }
}, 300);

const likeCheck = async () => {
  const userId = await getUserId();
  likes.value = loungeComments.value.map((post) => ({
    id: post.id,
    isLiked: post.likes ? post.likes.includes(userId) : false,
  }));
};

const handleSubmit = async () => {
  const userId = await getUserId();
  if (userId) {
    await createLoungeComment({ comment: inputText.value, post_id: props.postId, creator: loginUser.id });
    inputText.value = "";
    await loadLoungeComments(props.postId);
    await getUserId();
  } else {
    isModalOpen.value = true;
  }
};

const toggleModal = () => {
  isModalOpen.value = false;
  router.push("/signIn");
};

const handleDelete = async (commentId) => {
  await deleteLoungeComment(currentPost.value, commentId);
  await loadLoungeComments(props.postId);
  await getUserId();
};

const handleEdit = (comment) => {
  editingCommentId.value = comment.id;
  editedContent.value = comment.comment;
};

const handleUpdateComment = async (commentId) => {
  await updateLoungeComment(editedContent.value, commentId);
  await loadLoungeComments(props.postId);
  await getUserId();
  editingCommentId.value = null;
};

const handleCancelEdit = () => {
  editingCommentId.value = null;
  editedContent.value = "";
};

const getUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  loungeComments.value.map(async (i, index) => {
    const { data: userData, error: userError } = await supabase
      .from("userinfo")
      .select("nickname, profile_img")
      .eq("id", i.creator)
      .single();

    userInfo.value[index] = userData;
  });
  id.value = sessionData?.session?.user?.id;
  profile.value = sessionData?.session?.user.user_metadata.profile_img;
  return id.value;
};

onBeforeMount(async () => {
  await loadLoungeComments(props.postId), await getUserId(), await likeCheck();
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}월 ${day}일`;
};

const handleInput = (event) => {
  if (!id.value) {
    isModalOpen.value = true;
  } else {
    inputText.value = event.target.value;
  }
};
</script>

<template>
  <div class="p-4 rounded-t-[80px] bg-[#f4f4f4]">
    <div class="flex justify-center items-center py-2">댓글</div>
    <form @submit.prevent="handleSubmit" class="flex items-center gap-2 mb-4 p-3 rounded">
      <div class="relative inline-block">
        <div class="absolute inset-0 w-10 h-10 bg-gray-700 rounded-full -z-10"></div>
        <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4">
          <img :src="profile || userProfile" alt="유저 아이콘" class="w-12 h-12 rounded-full shadow-md object-cover" />
        </div>
      </div>
      <input
        :value="inputText"
        type="text"
        class="bg-transparent border-none flex-1 placeholder-[#B1B1B1]"
        placeholder="댓글 달기..."
        @input="handleInput"
      />
      <button type="submit" class="text-[#B1B1B1] hover:text-[#FF0000]">등록</button>
    </form>
    <ul v-if="comments.length" class="space-y-4">
      <li v-for="(comment, index) in comments" :key="index" class="flex items-start p-4 rounded-lg">
        <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4">
          <img
            :src="userInfo[index]?.profile_img || userProfile"
            @click="router.push(`/user/${userInfo[index].nickname}`)"
            alt="유저 아이콘"
            class="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
        </div>
        <div class="flex w-full">
          <div>
            <div class="flex w-full">
              <span class="font-bold">{{ userInfo[index]?.nickname }}</span>
            </div>
            <div class="text-gray-800 mb-2 mt-3">
              <span v-if="editingCommentId !== comment.id">{{ comment.comment }}</span>
              <div v-else>
                <textarea v-model="editedContent" type="text" class="border px-2 py-1 rounded w-[440px]" />
              </div>
            </div>
            <div class="flex text-[11px] text-gray-500">
              <span class="">좋아요 {{ comment?.likes?.length || "0" }} 개</span>
              <div class="flex gap-2 ml-4">
                <span>{{ formatDate(comment.created_at) }}</span>
                <div v-if="id === comment.creator && editingCommentId !== comment.id">
                  <button @click="handleEdit(comment)" class="text-[#909090] underline mb-2 ml-2 hover:text-[#FF0000]">
                    수정
                  </button>
                  <button
                    @click="handleDelete(comment.id)"
                    class="text-[#909090] underline mb-2 ml-1 hover:text-[#FF0000]"
                  >
                    삭제
                  </button>
                </div>
                <div v-else-if="id === comment.creator" class="flex items-center">
                  <button @click="handleUpdateComment(comment.id)" class="ml-2 mb-2 underline hover:text-[#FF0000]">
                    등록
                  </button>
                  <button @click="handleCancelEdit" class="ml-1 mb-2 underline hover:text-[#FF0000]">취소</button>
                </div>
                <div v-else></div>
              </div>
            </div>
          </div>
          <button @click="handleLike(comment.id)" class="ml-auto mt-2 text-gray-500">
            <img :src="likes.find((like) => like.id === comment.id)?.isLiked ? like : unlike" alt="좋아요" />
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500 text-center">아직 댓글이 없습니다.</p>
  </div>
  <ConfirmModal :isOpen="isModalOpen" :message="'로그인이 필요합니다.'" :buttonMessage="'확인'" @close="toggleModal">
  </ConfirmModal>
</template>

<style scoped>
input,
textarea {
  resize: none;
  outline: none;
}
</style>
