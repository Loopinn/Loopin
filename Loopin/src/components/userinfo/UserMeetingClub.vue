<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps(["postData"]);

const { postData } = props;

const handleClick = () => {
  router.push(`/club/${postData.id}`);
};
</script>
<template>
  <div class="w-[72px] flex flex-col items-center gap-2 cursor-pointer" @click="handleClick">
    <div class="bg-white w-[70px] h-[70px] rounded-[10px]">
      <img :src="postData.images[0]" alt="배너이미지" class="w-full h-full rounded-[10px]" />
    </div>
    <p class="text-[13px] text-[#6e6e6e] line-clamp-2">
      {{ postData.title }}
    </p>
  </div>
</template>
<style scoped></style>
