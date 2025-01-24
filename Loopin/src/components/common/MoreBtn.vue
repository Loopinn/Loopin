<script setup>
import { twMerge } from "tailwind-merge";
import { RouterLink } from "vue-router";

const props = defineProps(["link", "css"]);
</script>
<template>
  <RouterLink :to="props.link">
    <button
      :class="twMerge(`w-full h-[66px] rounded-2xl text-center text-[20px] bg-white ${props.css}`, `${props.css}`)"
    >
      더보기
    </button>
  </RouterLink>
</template>
<style scoped></style>
