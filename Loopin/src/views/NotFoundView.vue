<script setup>
import { useRouter } from "vue-router";

import NotFound from "@/assets/images/404.svg";
import ReturnLeft from "@/assets/images/return-left.svg";
import ReturnText from "@/assets/images/return-text.svg";

const router = useRouter();

function navigateHome() {
  router.push("/");
}
</script>
<template>
  <div class="flex flex-col justify-evenly align-center text-center h-[calc(100vh-144px)]">
    <p class="text-[28px] leading-10">페이지를 찾을 수 없습니다.</p>
    <img :src="NotFound" alt="404 Not Found" class="px-14" />

    <button class="flex justify-center" @click="navigateHome">
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
