<script setup>
import { ref, defineProps, defineEmits, onBeforeMount, computed } from "vue";
import CommentList from "./CommentList.vue";
import like from "@/assets/images/likeblack_full.svg";
import unlike from "@/assets/images/likeblack.svg";
import { debounce } from "lodash";
import { channelLike } from "@/utils/channelLike";
import ConfirmModal from "../modal/ConfirmModal.vue";
import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";

const text = ref("");

const props = defineProps({
  comments: {
    type: Array,
  },
  currentPost: {
    type: Object,
  },
  pageType: {
    type: String,
  },
  userId: {
    type: String,
  },
  isLiked: {
    type: Boolean,
  },
});
const authStore = useAuthStore();
const emit = defineEmits(["updateLike"]);

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

// 댓글 등록 버튼
const isButtonVisible = ref(false);

const showButton = () => {
  isButtonVisible.value = true;
};
const hideButton = () => {
  isButtonVisible.value = false;
};

// 좋아요
const isModalOpen = ref(false);

const tables = {
  socialing: "socialing_posts",
  club: "club_posts",
  challenge: "challenge_posts",
};

const table = (channel) => tables[channel] || null;

const likeCheck = async () => {
  const { data: userData, error: userDataError } = await supabase
    .from("userinfo")
    .select("postLikes")
    .eq("id", authStore.loginUser.id)
    .single();

  console.log(userData);

  if (userDataError) {
    console.error(userDataError);
  }

  const likedPosts = userData?.postLikes ? userData.postLikes.map((item) => JSON.parse(item)) : [];
  const isLikedNow = likedPosts.some((post) => post.id === props.currentPost.id);
  emit("updateLike", isLikedNow);
};

const handleLike = debounce(async () => {
  const tableName = table(props.pageType);
  if (props.userId) {
    await channelLike(props.currentPost, props.userId, tableName);
    emit("updateLike", !props.isLiked);
  } else {
    isModalOpen.value = true;
  }
}, 300);

const toggleModal = () => {
  isModalOpen.value = false;
};

onBeforeMount(() => {
  likeCheck();
});

// 댓글 모달
const commentModal = ref(false);

const commentModalOpen = () => {
  commentModal.value = !commentModal.value;
};

const commentModalClose = () => {
  commentModal.value = false;
};
</script>
<template>
  <div class="mt-5">
    <p :class="textColor">댓글</p>
    <p>게시글이 궁금하다면 댓글을 남겨보세요</p>
    <div class="mt-2 flex gap-3">
      <div class="flex gap-2">
        <button @click="handleLike">
          <img :src="props.isLiked ? like : unlike" alt="like" class="w-[30px] h-[30px]" />
        </button>
        <span>{{ props.currentPost.likes }}</span>
      </div>
      <div class="flex gap-2">
        <button>
          <img src="@/assets/images/comment.svg" alt="comment" @click="commentModalOpen" />
          <CommentList :isOpen="commentModal" @close="commentModalClose" />
        </button>
        <span>{{ props.comments ? props.comments.length : 0 }}</span>
      </div>
    </div>
    <div class="mt-3 flex gap-4">
      <img
        src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
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
      <button v-if="isButtonVisible" :disabled="!text.trim()" class="text-[#B1B1B1] hover:text-[#FF0000]">등록</button>
    </div>
  </div>
  <ConfirmModal :isOpen="isModalOpen" :message="'로그인이 필요합니다.'" :buttonMessage="'확인'" @close="toggleModal" />
</template>
<style scoped></style>
