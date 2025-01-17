<script setup>
import { ref } from "vue";
// 임시
const tags = ref(["취미", "사진"]);
</script>
<template>
  <div class="w-[570px] h-[200px] flex rounded-2xl">
    <img
      src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
      alt="thumbnail"
      class="w-40 h-40 rounded-2xl m-5"
    />
    <div class="mt-5 space-y-[6px]">
      <!-- 카테고리 태그 -->
      <div
        v-for="(tag, index) in tags"
        :key="index"
        class="bg-[#F4F4F4] text-[#666060] rounded-3xl inline-block text-center text-[18px] px-2 py-1 mr-[6px]"
      >
        {{ tag }}
      </div>
      <!-- 추천 태그 -->
      <div
        class="bg-[#fbecea] text-[#F43630] rounded-3xl inline-block text-center text-[18px] px-2 py-1"
      >
        추천
      </div>
      <p class="text-[24px]">11회) 연기 첫 경험</p>
      <p class="text-[#999999]">
        소셜링 ·
        <img
          src="@/assets/images/location_gray.svg"
          alt="location"
          class="inline-block mb-2"
        />관악구 · 1.25(토) 오후 3:00
      </p>
      <div class="flex items-center gap-2">
        <div class="flex -space-x-2">
          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />

          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />
          <!-- 참여 멤버 수가 5명 이상 ... -->
          <div class="relative w-9 h-9">
            <img
              src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
              alt="memberprofile"
              class="absolute top-0 left-0 w-9 h-9 rounded-full border-2 border-white"
            />
            <img
              src="@/assets/images/more.svg"
              alt="more"
              class="absolute top-0 left-0 w-9 h-9 rounded-full border-2 border-white"
            />
          </div>
        </div>
        <p class="text-[#999999]">6/20 · <span>진행확정</span></p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
