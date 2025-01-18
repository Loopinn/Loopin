<script setup>
import UserInfoFeed from "@/components/userinfo/UserInfoFeed.vue";
import { twMerge } from "tailwind-merge";
import { computed, ref } from "vue";

const infos = ref(["팔로워", "팔로잉", "피드"]);
const feedNav = ref("피드");

const desc = ref(
  "한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄 소개한줄소개",
);

const shortDesc = computed(() => {
  if (desc.value.length > 40 && !moreDesc.value) {
    return desc.value.replace(desc.value.slice(41), "...");
  } else {
    return desc.value;
  }
});

const moreDesc = ref(false);
</script>
<template>
  <div>
    <div class="py-5 px-3">
      <div class="w-[75px] h-[75px] rounded-full bg-pink-500"></div>
      <h1 class="font-extrabold text-[18px] my-3">철수</h1>
      <p class="w-[350px] text-[#383535]">
        {{ shortDesc }}
      </p>
      <p class="text-[#b9b6b6] hover:underline cursor-pointer" v-if="!moreDesc" @click="moreDesc = true">...더보기</p>
    </div>

    <!-- 팔로워 피드 -->
    <div class="flex justify-between items-center mt-[20px] px-3">
      <div class="flex gap-5">
        <div v-for="(info, index) in infos" :key="index" class="flex flex-col items-center text-[14px]">
          <p class="">{{ info }}</p>
          <p class="font-bold">0</p>
        </div>
      </div>
      <!-- 로그인한 유저만 보임 -->
      <button type="button" class="bg-[#F43630] text-white w-[65px] h-[30px] rounded-[25px]">팔로우</button>
    </div>

    <!-- 피드 정보 -->
    <div>
      <ul class="h-[45px] flex">
        <li
          :class="
            twMerge(
              `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '피드' ? 'border-black' : ''}`,
            )
          "
          @click="feedNav = '피드'"
        >
          피드
        </li>
        <li
          :class="
            twMerge(
              `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '태그' ? 'border-black' : ''}`,
            )
          "
          @click="feedNav = '태그'"
        >
          태그
        </li>
        <li
          :class="
            twMerge(
              `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '모임' ? 'border-black' : ''}`,
            )
          "
          @click="feedNav = '모임'"
        >
          모임
        </li>
      </ul>
      <div class="flex flex-wrap" v-if="feedNav === '피드'">
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
        <UserInfoFeed />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
