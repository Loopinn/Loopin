<script setup>
import { ref, defineProps, computed, onMounted } from "vue";
import CommentList from "./CommentList.vue";
import likeBlackIcon from "@/assets/images/likeblack.svg";
import likeBlackFillIcon from "@/assets/images/likeblack_full.svg";
import supabase from "@/config/supabase";

import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commetStore";
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";

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
  comment: {
    type: Array,
  },
  likes: {
    type: Number,
    required: true,
  },
  postId: {
    type: String,
  },
  pageType: {
    type: String,
    required: true,
  },
});

const text = ref("");
const userInfo = ref([]);
const userId = ref(null);
const profile = ref(null);

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

const currentPost = computed(() => {
  const posts = postMap[props.pageType];
  // return socialingPosts.value.find((post) => post.id === props.postId);
  return posts ? posts.value.find((post) => post.id === props.postId) : null;
});

const textColor = computed(() => {
  switch (props.pageType) {
    case "socialing":
      return "text-[#FF0000]";
    case "challenge":
      return "text-[#46A7CD]";
    case "club":
    default:
      return "text-[#1C8A6A]";
  }
});

const isHovering = ref(false);
// 댓글 등록 버튼
const isButtonVisible = ref(false);

const showButton = () => {
  isButtonVisible.value = true;
};
const hideButton = () => {
  isButtonVisible.value = false;
};

// 좋아요 버튼
const like = ref(false);

const isLiked = () => {
  like.value = !like.value;
};

// 댓글 모달
const commentModal = ref(false);

const commentModalOpen = () => {
  commentModal.value = !commentModal.value;
};

const commentModalClose = () => {
  commentModal.value = false;
};

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
  return sessionData?.session?.user?.id;
};

const handleSubmit = async () => {
  try {
    const userId = await getUserId();
    if (userId) {
      const createComment = createCommentMap[props.pageType];
      const loadComments = loadCommentsMap[props.pageType];
      console.log("댓글 등록 시도:", text.value);
      // await createSocialComment({ comment: text.value, post_id: props.postId, creator: loginUser.id });
      await createComment({ comment: text.value, post_id: props.postId, creator: loginUser.id });
      text.value = "";
      // await loadSocialComments(props.postId);
      await loadComments(props.postId);
      await getUserId();
      // 등록 버튼 안보이게 하기
      hideButton();
      console.log("댓글 등록 성공!");
    }
  } catch (error) {
    console.log("댓글 등록 실패:", error);
  }
};

// 댓글 추가 시 호출될 함수
const handleCommentAdded = async (postId) => {
  const loadComments = loadCommentsMap[props.pageType];
  // await loadSocialComments(postId);
  await loadComments(postId);
};

onMounted(async () => {
  const loadComments = loadCommentsMap[props.pageType];
  // await loadSocialComments(props.postId), await getUserId();
  await loadComments(props.postId), await getUserId();
});
</script>
<template>
  <div class="mt-5">
    <p :class="textColor">댓글</p>
    <p>게시글이 궁금하다면 댓글을 남겨보세요</p>
    <div class="mt-2 flex gap-3">
      <div class="flex gap-2">
        <button @click="isLiked">
          <img :src="like ? likeBlackFillIcon : likeBlackIcon" alt="like" class="w-[30px] h-[30px]" />
        </button>
        <span>{{ likes }}</span>
      </div>
      <div class="flex gap-2">
        <button>
          <img src="@/assets/images/comment.svg" alt="comment" @click="commentModalOpen" />
          <CommentList
            :comments="
              props.pageType === 'socialing'
                ? socialComments || []
                : props.pageType === 'club'
                  ? clubComments || []
                  : challengeComments || []
            "
            :userInfo="userInfo"
            :postId="props.postId"
            :pageType="props.pageType"
            :isOpen="commentModal"
            @close="commentModalClose"
            @commentAdded="handleCommentAdded"
          />
        </button>
        <span v-if="props.pageType === 'socialing'">{{ socialComments.length || 0 }}</span>
        <span v-else-if="props.pageType === 'club'">{{ clubComments.length || 0 }}</span>
        <span v-else>{{ challengeComments.length || 0 }}</span>
      </div>
    </div>
    <form @submit.prevent="handleSubmit" class="mt-3 flex gap-4">
      <img
        :src="profile || 'https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg'"
        alt="userProfile"
        class="rounded-full w-7 h-7"
      />
      <input
        v-model="text"
        type="text"
        placeholder="댓글 달기 ..."
        class="w-[300px] resize-none placeholder-[#B1B1B1] bg-[#f1f1f1]"
        @focus="showButton"
        @blur="hideButton"
      />
      <button
        type="submit"
        v-if="isButtonVisible || isHovering"
        :disabled="!text.trim()"
        class="text-[#B1B1B1] hover:text-[#FF0000]"
        @mouseover="isHovering = true"
        @mouseleave="isHovering = false"
      >
        등록
      </button>
    </form>
  </div>
</template>
<style scoped></style>
