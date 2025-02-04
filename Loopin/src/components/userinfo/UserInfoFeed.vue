<script setup>
import { useRouter } from "vue-router";

const props = defineProps(["feedData"]);

const router = useRouter();
</script>
<template>
  <img
    :src="props.feedData?.images[0]"
    alt="피드 대표 이미지"
    class="w-[200px] h-[200px] bg-white border cursor-pointer object-cover"
    @click="router.push(`/lounge/${props.feedData.id}`)"
  />
</template>
<style scoped></style>
