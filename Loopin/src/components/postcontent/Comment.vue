<script setup>
import { ref } from "vue";
import CommentList from "./CommentList.vue";

const text = ref("");

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
</script>
<template>
  <div class="mt-5">
    <div class="text-[#FF0000]">댓글</div>
    <div class="font-bold">소셜링이 궁금하다면 댓글을 남겨보세요</div>
    <div class="mt-2 flex gap-3">
      <div class="flex gap-2">
        <button @click="isLiked">
          <img
            :src="like ? './src/assets/images/likeblack_full.svg' : './src/assets/images/likeblack.svg'"
            alt="like"
            class="w-[30px] h-[30px]"
          />
        </button>
        <span>00</span>
      </div>
      <div class="flex gap-2">
        <button>
          <img src="@/assets/images/comment.svg" alt="comment" @click="commentModalOpen" />
          <CommentList :isOpen="commentModal" @close="commentModalClose" />
        </button>
        <span>00</span>
      </div>
      <div class="flex -space-x-[6px]">
        <img
          src="https://i.pinimg.com/474x/80/62/05/8062059a91ba1da4fde46dc9117371e8.jpg"
          alt="userProfile"
          class="rounded-full w-7 h-7 mt-[6px] border-2 border-[#f1f1f1]"
        />
        <img
          src="https://i.pinimg.com/474x/80/62/05/8062059a91ba1da4fde46dc9117371e8.jpg"
          alt="userProfile"
          class="rounded-full w-7 h-7 mt-[6px] border-2 border-[#f1f1f1]"
        />
        <img
          src="https://i.pinimg.com/474x/80/62/05/8062059a91ba1da4fde46dc9117371e8.jpg"
          alt="userProfile"
          class="rounded-full w-7 h-7 mt-[6px] border-2 border-[#f1f1f1]"
        />
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
</template>
<style scoped></style>
