<script setup>
import { ref } from "vue";

const text = ref("");

// 작성자 확인
const isAuth = ref(false);

// 좋아요 버튼
const like = ref(false);

const isLiked = () => {
  like.value = !like.value;
};

// 댓글 모달
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
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
        <div class="flex justify-center gap-[10px] py-3">
          <img src="@/assets/images/defaultprofile.svg" alt="userprofile" class="w-7 h-7 rounded-full" />

          <div class="flex flex-col items-start">
            <div class="mb-2 font-semibold text-[11px]">유저명</div>
            <p class="mb-2 w-[300px] text-[10px] text-left">
              댓글입니다.댓글입니다.댓글입니다.댓글입니다.댓글입니다.댓글입니다.댓글입니다.댓글입니다.댓글입니다.
            </p>
            <div class="font-semibold text-[9px] text-[#909090]">
              <p>2025.01.20 좋아요 1개</p>
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

            <button class="ml-7" @click="isLiked">
              <img
                :src="like ? './src/assets/images/likeblack_full.svg' : './src/assets/images/likeblack.svg'"
                alt="like"
                class="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- 댓글 입력란 -->
      <div class="absolute bottom-0 pb-3 flex justify-center w-[80%] gap-4 py-2 border-t border-gray-300 bg-white">
        <img
          src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
          alt="userProfile"
          class="rounded-full w-7 h-7"
        />
        <input
          v-model="text"
          type="text"
          placeholder="댓글 달기 ..."
          class="w-[78%] resize-none placeholder-[#B1B1B1] outline-none"
        />
        <button class="text-[#B1B1B1] hover:text-[#FF0000]" :disabled="!text.trim()">등록</button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
