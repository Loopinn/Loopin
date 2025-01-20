<script setup>
import { defineProps } from "vue";

defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
    <div class="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
  </div>
</template>
