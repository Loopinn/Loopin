<script setup>
import { twMerge } from "tailwind-merge";

const props = defineProps(["text", "css"]);
</script>
<template>
  <p :class="twMerge(`text-[#898989] ${props.css}`)">{{ props.text }}</p>
</template>
<style scoped></style>
