<script setup>
import { ref } from "vue";

// 팔로우 버튼
const following = ref(false);

const clickFollow = () => {
  following.value = !following.value;
};

// 멤버 리스트 모달
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
        <div class="font-semibold text-[15px]">가입 멤버</div>
      </div>
      <!-- 멤버 리스트 -->
      <div class="border-t border-gray-300 w-[80%] h-[90%] overflow-y-scroll scrollbar-hide">
        <div class="flex justify-center gap-[10px] py-3">
          <img src="@/assets/images/defaultprofile.svg" alt="userprofile" class="rounded-full w-9 h-9 mr-2" />
          <div class="flex flex-col">
            <div class="text-[15px]">유저이름</div>
            <div class="w-[300px] text-[13px] text-[#B1B1B1] truncate ...">
              유저 소개글유저 소개글유저 소개글유저 소개글유저 소개글유저 소개글유저 소개글유저 소개글
            </div>
          </div>
          <button
            :class="following ? 'bg-white border border-[#ff0000] text-[#ff0000]' : 'bg-[#ff0000] text-white'"
            class="mt-2 w-[50px] h-[30px] rounded-2xl text-[12px] font-semibold"
            @click="clickFollow"
          >
            {{ following ? "팔로잉" : "팔로우" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
