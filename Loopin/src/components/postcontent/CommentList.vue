<script setup>
import { defineProps, ref, reactive, defineEmits, onBeforeMount, onMounted, watch, watchEffect, computed } from "vue";
import supabase from "@/config/supabase";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commetStore";
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";
import likeBlackIcon from "@/assets/images/likeblack.svg";
import likeBlackFullIcon from "@/assets/images/likeblack_full.svg";
import noProfile from "@/assets/images/no-profile.svg";

const authStore = useAuthStore();
const commentStore = useCommentStore();
const postStore = usePostStore();

const { loginUser } = authStore;
const { socialComments } = storeToRefs(commentStore);
const { socialingPosts } = storeToRefs(postStore);
const { clubComments } = storeToRefs(commentStore);
const { clubPosts } = storeToRefs(postStore);
const { challengeComments } = storeToRefs(commentStore);
const { challengePosts } = storeToRefs(postStore);

const props = defineProps({
  comments: {
    type: Array,
  },
  userInfo: {
    type: Array,
    required: true,
  },
  postId: {
    type: String,
  },
  pageType: {
    type: String,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const {
  loadSocialComments,
  createSocialComment,
  deleteSocialComment,
  updateSocialComment,
  socialCommentLike,
  socialCommentUnLike,

  loadClubComments,
  createClubComment,
  deleteClubComment,
  updateClubComment,
  clubCommentLike,
  clubCommentUnLike,

  loadChallengeComments,
  createChallengeComment,
  deleteChallengeComment,
  updateChallengeComment,
  challengeCommentLike,
  challengeCommentUnLike,
} = commentStore;

// 어디서 왔는지에 따라 다른 함수 지정
const postMap = {
  socialing: socialingPosts,
  club: clubPosts,
  challenge: challengePosts,
};

const commentMap = {
  socialing: socialComments,
  club: clubComments,
  challenge: challengeComments,
};

const createCommentMap = {
  socialing: createSocialComment,
  club: createClubComment,
  challenge: createChallengeComment,
};

const loadCommentsMap = {
  socialing: loadSocialComments,
  club: loadClubComments,
  challenge: loadChallengeComments,
};
const deleteCommentsMap = {
  socialing: deleteSocialComment,
  club: deleteClubComment,
  challenge: deleteChallengeComment,
};
const updateCommentsMap = {
  socialing: updateSocialComment,
  club: updateClubComment,
  challenge: updateChallengeComment,
};

const emit = defineEmits(["close", "commentAdded"]);

const router = useRouter();

const text = ref("");
const userInfo = ref(props.userInfo);
const userId = ref(null);
const profile = ref(null);

// 작성자 확인
const getUserId = async () => {
  const mapComments = commentMap[props.pageType];

  const { data: sessionData } = await supabase.auth.getSession();
  mapComments.value.map(async (i, index) => {
    const { data: userData, error: userError } = await supabase
      .from("userinfo")
      .select("nickname, profile_img")
      .eq("id", i.creator)
      .single();

    userInfo.value[index] = userData;
  });
  userId.value = sessionData?.session?.user?.id || "";
  profile.value = sessionData?.session?.user.user_metadata.profile_img;
  return sessionData?.session?.user?.id || "";
};

const handleSubmit = async () => {
  try {
    const userId = await getUserId();
    if (userId) {
      const createComment = createCommentMap[props.pageType];
      const loadComments = loadCommentsMap[props.pageType];
      await createComment({ comment: text.value, post_id: props.postId, creator: loginUser.id });
      text.value = "";
      await loadComments(props.postId);
      await getUserId();
      emit("commentAdded", props.postId);
    }
  } catch (error) {
    console.log("댓글 등록 실패:", error);
  }
};

const currentPost = computed(() => {
  const posts = postMap[props.pageType];
  return posts ? posts.value.find((post) => post.id === props.postId) : null;
});

// 댓글 수정
const editingCommentId = ref(null);
const editedContent = ref("");
const handleEdit = (comment) => {
  editingCommentId.value = comment.id;
  editedContent.value = comment.comment;
};

const handleUpdateComment = async (commentId) => {
  const updateComment = updateCommentsMap[props.pageType];
  const loadComment = loadCommentsMap[props.pageType];
  await updateComment(editedContent.value, commentId);
  await loadComment(props.postId);
  editingCommentId.value = null;
};

const handleCancelEdit = () => {
  editingCommentId.value = null;
  editedContent.value = "";
};

// 댓글 삭제
const handleCommentDelete = async (commentId) => {
  const deleteComments = deleteCommentsMap[props.pageType];
  const loadComments = loadCommentsMap[props.pageType];
  await deleteComments(currentPost.value, commentId);
  await getUserId();
  await loadComments(props.postId);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const closeModal = () => {
  emit("close");
  handleCancelEdit();
};

// 좋아요 버튼
const likes = ref({});

const initiallizeLikes = () => {
  if (!loginUser) return;
  props.comments.forEach((comment) => {
    if (comment.likes && comment.likes.includes(loginUser.id)) {
      likes.value[comment.id] = true;
    } else {
      likes.value[comment.id] = false;
    }
  });
};

// 소셜링, 클럽, 챌린지 댓글 좋아요, 좋아요취소 함수 설정
const commentLikeActions = {
  socialing: { like: socialCommentLike, unlike: socialCommentUnLike },
  club: { like: clubCommentLike, unlike: clubCommentUnLike },
  challenge: { like: challengeCommentLike, unlike: challengeCommentUnLike },
};

const handleCommentLike = async (commentInfo) => {
  const { like, unlike } = commentLikeActions[props.pageType] || {};
  if (!like || !unlike) return;

  if (commentInfo.likes && commentInfo.likes.includes(loginUser.id)) {
    // 좋아요 취소
    await unlike(commentInfo, loginUser.id);
    likes.value[commentInfo.id] = !likes.value[commentInfo.id];

    const index = props.comments.findIndex((c) => c.id === commentInfo.id);
    props.comments[index].likes = props.comments[index].likes.filter((id) => id !== loginUser.id);
  } else {
    // 좋아요~
    await like(commentInfo, loginUser.id);
    likes.value[commentInfo.id] = !likes.value[commentInfo.id];
    const index = props.comments.findIndex((c) => c.id === commentInfo.id);
    if (props.comments[index].likes) {
      props.comments[index].likes.push(loginUser.id);
    } else {
      props.comments[index].likes = [`${loginUser.id}`];
    }
  }
};

onBeforeMount(async () => {
  initiallizeLikes();

  const { data: sessionData } = await supabase.auth.getSession();
  profile.value = sessionData?.session?.user.user_metadata.profile_img;
});

watchEffect(() => {
  if (props.isOpen) {
    initiallizeLikes();
  } else {
    initiallizeLikes();
  }
});
</script>
<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
    <!-- 모달창 -->
    <div class="absolute bottom-0 z-10 w-[600px] h-5/6 bg-white rounded-lg pt-6 flex flex-col items-center">
      <!-- 상단 -->
      <div class="flex h-10">
        <button class="absolute left-4" @click="closeModal">
          <img src="@/assets/images/arrow-left.svg" alt="back" />
        </button>
        <div class="font-semibold text-[15px]">댓글</div>
      </div>

      <!-- 댓글 -->
      <div class="border-t border-gray-300 w-[80%] h-[80%] overflow-y-scroll scrollbar-hide">
        <div v-for="(comment, idx) in comments" :key="idx" class="flex justify-center gap-[10px] py-3">
          <img
            v-if="userInfo[idx]?.profile_img"
            :src="userInfo[idx].profile_img"
            alt="userprofile"
            class="w-10 h-10 rounded-full object-cover"
            @click="router.push(`/user/${userInfo[idx].nickname}`)"
          />

          <img
            v-else
            src="@/assets/images/no-profile.svg"
            alt="userprofile"
            class="w-10 h-10 rounded-full"
            @click="router.push(`/user/${userInfo[idx].nickname}`)"
          />

          <div class="flex flex-col items-start">
            <div class="mb-2 font-semibold text-[14px]">{{ userInfo[idx]?.nickname }}</div>
            <div class="mb-2 w-[300px] text-[12px] text-left whitespace-normal break-all">
              <span v-if="editingCommentId !== comment.id">{{ comment.comment }}</span>
              <div v-else>
                <textarea
                  v-model="editedContent"
                  type="text"
                  class="w-[300px] resize-none outline-none rounded border-2 border-black"
                />
              </div>
            </div>

            <div class="font-semibold text-[11px] text-[#909090]">
              {{ formatDate(comment.created_at) }} 좋아요 {{ comment.likes?.length || 0 }}개
            </div>
          </div>

          <div class="flex flex-col -ml-9" v-if="loginUser">
            <div v-if="loginUser.id === comment.creator && editingCommentId !== comment.id" class="flex gap-2">
              <button
                class="text-[10px] text-[#909090] underline mb-2 hover:text-[#FF0000]"
                @click="handleEdit(comment)"
              >
                수정
              </button>
              <button
                class="text-[10px] text-[#909090] underline mb-2 hover:text-[#FF0000]"
                @click="handleCommentDelete(comment.id)"
              >
                삭제
              </button>
            </div>
            <div v-else-if="loginUser.id === comment.creator" class="flex gap-2 mr-2">
              <button
                class="text-[10px] text-[#909090] underline mb-2 hover:text-[#FF0000]"
                @click="handleUpdateComment(comment.id)"
              >
                등록
              </button>
              <button class="text-[10px] text-[#909090] underline mb-2 hover:text-[#FF0000]" @click="handleCancelEdit">
                취소
              </button>
            </div>
            <div v-else></div>
            <button
              v-if="loginUser"
              class="ml-7"
              @click="
                async () => {
                  await handleCommentLike(comment);
                  console.log(comment, loginUser);
                }
              "
            >
              <img :src="likes[comment.id] ? likeBlackFullIcon : likeBlackIcon" alt="like" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- 댓글 입력란 -->
      <form
        @submit.prevent="handleSubmit"
        class="absolute bottom-0 pb-3 flex justify-center w-[80%] gap-4 py-2 border-t border-gray-300 bg-white"
      >
        <img :src="profile || noProfile" alt="userProfile" class="rounded-full w-8 h-8 object-cover" />
        <input
          v-model="text"
          :disabled="!loginUser"
          type="text"
          placeholder="댓글 달기 ..."
          class="w-[78%] resize-none placeholder-[#B1B1B1] outline-none"
        />
        <button
          type="submit"
          class="text-[#B1B1B1] hover:text-[#FF0000] disabled:hover:text-[#b1b1b1]"
          :disabled="!text.trim() && !loginUser"
        >
          등록
        </button>
      </form>
    </div>
  </div>
</template>
<style scoped></style>
