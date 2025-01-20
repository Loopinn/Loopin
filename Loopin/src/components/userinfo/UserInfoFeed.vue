<script setup>
import { useRouter } from "vue-router";

const props = defineProps(["feedData"]);
console.log(props.feedData);

const router = useRouter();
</script>
<template>
  <img
    :src="props.feedData.images[0]"
    alt="피드 대표 이미지"
    class="w-[200px] h-[300px] bg-white border cursor-pointer"
    @click="router.push(`/lounge/${props.feedData.id}`)"
  />
</template>
<style scoped></style>
