<script setup>
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import ChannelSubcategory from "@/components/channel/ChannelSubcategory.vue";
import { twMerge } from "tailwind-merge";
import { ref } from "vue";

const categories = ref(["푸드·드링크", "자기계발", "취미", "파티·게임", "문화·예술", "연애·사랑", "동네·또래"]);

const selectedCategory = ref(0);

const clickCategory = (index) => {
  selectedCategory.value = index;
};
</script>
<template>
  <div class="mx-auto py-3 min-h-screen w-[600px] bg-[#F4F4F4]">
    <div class="mx-[15px]">
      <!-- categories -->
      <div class="mb-7 pl-1">
        <button
          v-for="(category, index) in categories"
          :key="index"
          :class="[
            twMerge(
              'text-[#8A8A8A] text-[14px] rounded-2xl inline-block px-2 py-1 mr-[6px] mb-2 border border-[#D9D9D9]',
              selectedCategory === index ? 'border border-black bg-white' : '',
            ),
          ]"
          @click="clickCategory(index)"
        >
          {{ category }}
        </button>
      </div>
      <!-- subcategories -->
      <ChannelSubcategory />
      <!-- channelpostcard -->
      <ChannelPostCard />
      <ChannelPostCard />
      <ChannelPostCard />
    </div>
  </div>
</template>
<style scoped></style>
