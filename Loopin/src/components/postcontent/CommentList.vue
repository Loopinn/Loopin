<script setup>
import { defineProps, ref, reactive, defineEmits, onBeforeMount, onMounted, watch, watchEffect } from "vue";
import supabase from "@/config/supabase";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commetStore";
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";
import likeBlackIcon from "@/assets/images/likeblack.svg";
import likeBlackFullIcon from "@/assets/images/likeblack_full.svg";

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

const emit = defineEmits(["close", "commentAdded"]);

const router = useRouter();

const text = ref("");
const userInfo = ref(props.userInfo);
const userId = ref(null);
const profile = ref(null);

// 작성자 확인
const isAuth = ref(false);

const getUserId = async () => {
  const mapComments = commentMap[props.pageType];

  const { data: sessionData } = await supabase.auth.getSession();
  // socialComments.value.map(async (i, index) => {
  mapComments.value.map(async (i, index) => {
    const { data: userData, error: userError } = await supabase
      .from("userinfo")
      .select("nickname, profile_img")
      .eq("id", i.creator)
      .single();

    userInfo.value[index] = userData;
  });
  userId.value = sessionData?.session?.user?.id || "";
  profile.value = sessionData?.session?.user.profile_img;
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const closeModal = () => {
  emit("close");
};

// 좋아요 버튼
const likes = ref({});

const initiallizeLikes = () => {
  console.log("이니셜");
  props.comments.forEach((comment) => {
    console.log(comment.likes);
    if (comment.likes && comment.likes.includes(loginUser.id)) {
      likes.value[comment.id] = true;
    } else {
      likes.value[comment.id] = false;
    }
  });
  console.log("likes", likes.value);
};

const handleCommentLike = async (commentInfo) => {
  if (props.pageType === "socialing") {
    // 소셜링 댓글 좋아요
    if (commentInfo.likes && commentInfo.likes.includes(loginUser.id)) {
      // 좋아요 취소
      await socialCommentUnLike(commentInfo, loginUser.id);
      likes.value[commentInfo.id] = !likes.value[commentInfo.id];

      const index = props.comments.findIndex((c) => c.id === commentInfo.id);
      props.comments[index].likes = props.comments[index].likes.filter((id) => id !== loginUser.id);
    } else {
      // 좋아요~
      await socialCommentLike(commentInfo, loginUser.id);
      likes.value[commentInfo.id] = !likes.value[commentInfo.id];
      const index = props.comments.findIndex((c) => c.id === commentInfo.id);
      if (props.comments[index].likes) {
        props.comments[index].likes.push(loginUser.id);
      } else {
        props.comments[index].likes = [`${loginUser.id}`];
      }
    }
  } else if (props.pageType === "club") {
    // 클럽 댓글 좋아요
    if (commentInfo.likes && commentInfo.likes.includes(loginUser.id)) {
      // 좋아요 취소
      await clubCommentUnLike(commentInfo, loginUser.id);
      likes.value[commentInfo.id] = !likes.value[commentInfo.id];

      const index = props.comments.findIndex((c) => c.id === commentInfo.id);
      props.comments[index].likes = props.comments[index].likes.filter((id) => id !== loginUser.id);
    } else {
      // 좋아요~
      await clubCommentLike(commentInfo, loginUser.id);
      likes.value[commentInfo.id] = !likes.value[commentInfo.id];
      const index = props.comments.findIndex((c) => c.id === commentInfo.id);
      if (props.comments[index].likes) {
        props.comments[index].likes.push(loginUser.id);
      } else {
        props.comments[index].likes = [`${loginUser.id}`];
      }
    }
  }
};

onBeforeMount(() => {
  console.log("props  ", props);
  initiallizeLikes();
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
            class="w-7 h-7 rounded-full"
            @click="router.push(`/user/${userInfo[idx].nickname}`)"
          />

          <img
            v-else
            src="@/assets/images/defaultprofile.svg"
            alt="userprofile"
            class="w-7 h-7 rounded-full"
            @click="router.push(`/user/${userInfo[idx].nickname}`)"
          />

          <div class="flex flex-col items-start">
            <div class="mb-2 font-semibold text-[11px]">{{ userInfo[idx]?.nickname }}</div>
            <p class="mb-2 w-[300px] text-[10px] text-left">
              {{ comment.comment }}
            </p>
            <div class="font-semibold text-[9px] text-[#909090]">
              {{ formatDate(comment.created_at) }} 좋아요 {{ comment.likes?.length || 0 }}개
            </div>
          </div>

          <div class="flex flex-col -ml-9">
            <div class="flex gap-2 mr-2">
              <button
                class="text-[10px] text-[#909090] underline mb-2 hover:text-[#FF0000]"
                :class="{ invisible: isAuth }"
              >
                수정
              </button>
              <button
                class="text-[10px] text-[#909090] underline mb-2 hover:text-[#FF0000]"
                :class="{ invisible: isAuth }"
              >
                삭제
              </button>
            </div>

            <button
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
        <img
          :src="profile || 'https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg'"
          alt="userProfile"
          class="rounded-full w-7 h-7"
        />
        <input
          v-model="text"
          type="text"
          placeholder="댓글 달기 ..."
          class="w-[78%] resize-none placeholder-[#B1B1B1] outline-none"
        />
        <button type="submit" class="text-[#B1B1B1] hover:text-[#FF0000]" :disabled="!text.trim()">등록</button>
      </form>
    </div>
  </div>
</template>
<style scoped></style>
