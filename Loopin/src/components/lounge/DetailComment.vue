<script setup>
import supabase from "@/config/supabase";
import { computed, onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commetStore";
import userProfile from "@/assets/images/defaultprofile30.svg";
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const inputText = ref("");
const nickname = ref("");
const editingCommentId = ref(null);
const editedContent = ref("");

const authStore = useAuthStore();
const commentStore = useCommentStore();
const postStore = usePostStore();
const { loginUser } = authStore;
const { loungeComments } = storeToRefs(commentStore);
const { loungePosts } = storeToRefs(postStore);
const { loadLoungeComments, createLoungeComment, deleteLoungeComment, updateLoungeComment } = commentStore;

const comments = computed(() => loungeComments.value.filter((comment) => comment.post_id === props.postId) || []);

const currentPost = computed(() => {
  return loungePosts.value.find((post) => post.id === props.postId);
});

const handleSubmit = async  () => {
  await createLoungeComment({ comment: inputText.value, post_id: props.postId, creator: loginUser.id });
  inputText.value = "";
  await loadLoungeComments(props.postId);
};

const handleDelete = async (commentId) => {
  await deleteLoungeComment(currentPost.value, commentId);
  await loadLoungeComments(props.postId);
};

const handleEdit = (comment) => {
  editingCommentId.value = comment.id;
  editedContent.value = comment.comment;
};

const handleUpdateComment = async (commentId) => {
  await updateLoungeComment(editedContent.value, commentId);
  await loadLoungeComments(props.postId);
  editingCommentId.value = null;
};

const handleCancelEdit = () => {
  editingCommentId.value = null;
  editedContent.value = "";
};

const getUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  nickname.value = sessionData?.session?.user?.user_metadata?.nickname;
};

onBeforeMount(() => {
  getUserId();
  loadLoungeComments(props.postId);
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};
</script>

<template>
  <div class="p-4 rounded-b-lg">
    <form @submit.prevent="handleSubmit" class="flex items-center gap-2 mb-4 p-3 rounded">
      <div class="relative inline-block">
        <div class="absolute inset-0 w-10 h-10 bg-gray-700 rounded-full -z-10"></div>
        <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
          <img :src="userProfile" alt="유저 아이콘" class="w-8 h-8 " />
        </div>
      </div>
      <input v-model="inputText" type="text" class="bg-transparent border-none flex-1 placeholder-[#B1B1B1]" placeholder="댓글 달기..." />
      <button type="submit" class="text-[#B1B1B1] hover:text-[#FF0000]">
        등록
      </button>
    </form>
    <ul v-if="comments.length" class="space-y-4">
      <li v-for="comment in comments" :key="comment.id" class="flex items-start p-4 rounded-lg">
        <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
          <img :src="userProfile" alt="유저 아이콘" class="w-8 h-8 " />
        </div>
        <div class="flex w-full">
          <div>
            <div class="flex w-full">
              <span class="font-bold">{{ nickname }}</span>
            </div>
            <div class="text-gray-800 mb-2 mt-3">
              <span v-if="editingCommentId !== comment.id">{{ comment.comment }}</span>
              <div v-else>
                <textarea v-model="editedContent" type="text" class="border px-2 py-1 rounded w-[440px]" />
              </div>
            </div>
            <div class="flex text-[11px] text-gray-500">
              <span class="ml-2">좋아요 {{ comment.likes || 0 }}개</span>
              <div class="flex gap-2 ml-4">
                <div v-if="editingCommentId !== comment.id">
                  <span>{{ formatDate(comment.created_at) }}</span>
                  <button
                    @click="handleEdit(comment)"
                    class="text-[#909090] underline mb-2 ml-2 hover:text-[#FF0000]"
                  >
                    수정
                  </button>
                  <button
                    @click="handleDelete(comment.id)"
                    class="text-[#909090] underline mb-2 ml-1 hover:text-[#FF0000]"
                  >
                    삭제
                  </button>
                </div>
                <div v-else class="flex items-center">
                  <button @click="handleUpdateComment(comment.id)" class="ml-2 mb-2 text-blue-500">등록</button>
                  <button @click="handleCancelEdit" class="ml-2 mb-2 text-red-500">취소</button>
                </div>
              </div>
            </div>
          </div>
           
          <button class="ml-auto mt-2 text-gray-500"><img src="@/assets/images/likeblack.svg" alt="좋아요" /></button>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500">아직 댓글이 없습니다.</p>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
  outline: none;
}
</style>
