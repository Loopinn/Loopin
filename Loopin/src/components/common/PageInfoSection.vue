<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "로고 아이콘",
  },
});
</script>

<template>
  <div class="text-center">
    <h2 class="text-base mb-2 flex items-center justify-center gap-1">
      <img :src="icon" :alt="alt" class="w-5 h-5" />
      {{ title }}
    </h2>
    <h3 class="text-2xl leading-relaxed">
      <template v-for="(line, index) in subtitle.split('\n')" :key="index">
        {{ line }}
        <br v-if="index < subtitle.split('\n').length - 1" />
      </template>
    </h3>
  </div>
</template>

