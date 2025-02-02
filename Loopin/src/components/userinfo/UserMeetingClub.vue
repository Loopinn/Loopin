<script setup>
import { resizeImage } from "@/utils/resizeImage";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps(["postData"]);

const { postData } = props;

const handleClick = () => {
  router.push(`/club/${postData.id}`);
};

//프로필 이미지 리사이즈
const resizedProfile = ref(null);
const resizeProfile = () => {
  const img = new Image();
  img.crossOrigin = "anonymous"; // CORS 설정 추가
  img.onload = () => {
    // 리사이징된 이미지 URL 얻기
    resizedProfile.value = resizeImage(img, 200, 200);
  };
  // 외부 URL에서 이미지 로드
  img.src = postData.images[0];
};

onMounted(() => {
  resizeProfile();
});
</script>
<template>
  <div class="w-[72px] flex flex-col items-center gap-2 cursor-pointer" @click="handleClick">
    <div class="bg-white w-[70px] h-[70px] rounded-[10px]">
      <img
        v-if="resizedProfile"
        :src="resizedProfile"
        alt="배너이미지"
        class="w-full h-full rounded-[10px] object-cover"
      />
    </div>
    <p class="text-[13px] text-[#6e6e6e] line-clamp-2 text-center">
      {{ postData.title }}
    </p>
  </div>
</template>
<style scoped></style>
