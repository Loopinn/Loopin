<script setup>
import ReturnLeft from "@/assets/images/return-left.svg";
import ReturnText from "@/assets/images/return-text.svg";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
<template>
  <div
    class="flex flex-col items-center justify-center gap-1 text-center p-6 bg-gray-100 shadow-md"
    style="height: calc(100vh - 193px)"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-2">유저를 찾을 수 없습니다 !</h2>
    <button type="button" class="flex justify-center" @click="router.push('/')">
      <div
        class="flex w-[160px] h-[48px] items-center justify-center rounded-[30px] border-[3px] border-black bg-[#ECECEC] shadow-[inset_0_0_0_4px_#FFF]"
      >
        <img :src="ReturnLeft" alt="Home" class="w-[20px] h-[16px] pb-[2px]" />
        <img :src="ReturnText" alt="홈으로 이동" class="w-[80px] h-[16px] ml-[12px]" />
      </div>
    </button>
  </div>
</template>
<style scoped></style>
