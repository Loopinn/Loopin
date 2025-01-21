<script setup>
import { ref } from "vue";
import MemberInfoList from "./MemberInfoList.vue";

const memberInfoModal = ref(false);

const memberInfoModalOpen = () => {
  memberInfoModal.value = !memberInfoModal.value;
};

const memberInfoModalClose = () => {
  memberInfoModal.value = false;
};
</script>
<template>
  <div class="mt-5">
    <div class="text-[#FF0000]">멤버 소개</div>
    <div class="font-bold">자세한 정보를 알려드릴게요</div>
    <div class="flex gap-1 mt-2">
      <img
        src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
        alt="userProfile"
        class="rounded-full w-9 h-9"
      />
      <div class="flex flex-col">
        <div class="text-[15px]">유저이름</div>
        <div class="text-[13px] text-[#B1B1B1]">유저 소개글</div>
      </div>
    </div>

    <div class="flex gap-1 mt-2">
      <img
        src="https://i.pinimg.com/474x/2e/36/de/2e36dee43874ca143efb4c6323188be6.jpg"
        alt="userProfile"
        class="rounded-full w-9 h-9"
      />
      <div class="flex flex-col">
        <div class="text-[15px]">유저이름</div>
        <div class="text-[13px] text-[#B1B1B1]">유저 소개글</div>
      </div>
    </div>

    <button
      class="flex items-center justify-center mt-2 w-full h-[40px] rounded-[5px] bg-white font-semibold"
      @click="memberInfoModalOpen"
    >
      더보기 >
    </button>
    <!-- 멤버 리스트 모달 -->
    <MemberInfoList :isOpen="memberInfoModal" @close="memberInfoModalClose" />
  </div>
</template>
<style scoped></style>
