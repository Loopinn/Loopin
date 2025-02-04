<!-- components/Funnel.vue -->
<script setup>
import { defineProps, ref, watch, onMounted } from "vue";

// Props로 단계를 정의
defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: String,
    required: true,
  },
});
</script>

<template>
    <div>
      <!-- 현재 단계와 일치하는 슬롯만 렌더링 -->
      <slot :name="currentStep"></slot>
    </div>
  </template>
