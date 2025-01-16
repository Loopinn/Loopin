<script setup>
import PageInfoSection from "@/components/common/PageInfoSection.vue";
// 임시 이미지 삭제예정
import rectangleImage from "../assets/images/dummy.svg";
import loungeLogo from "../assets/images/loungLogo.svg";

//임시 데이터 삭제예정
const feeds = [
  {
    id: 1,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 2,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 3,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 4,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 5,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 6,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 7,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 8,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
  {
    id: 9,
    image: rectangleImage,
    description: "늦저녁을 오롯하게 즐길 준다. 나를 만난 하루니까? 하루니까? 새로운 한 하루",
  },
];
</script>

<template>
  <div class="px-5 py-6 bg-gray-50 min-h-screen w-full mx-auto pb-[64px]">
    <!-- 메인 콘텐츠 -->
    <div class="space-y-8">
      <PageInfoSection
        :icon="loungeLogo"
        title="라운지"
        subtitle="비슷한 관심사를 가진
        멤버들의 취향 피드 구독하기"
        alt="라운지 로고"
      />
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="feed in feeds" :key="feed.id" class="space-y-2">
          <img :src="feed.image" :alt="feed.description" class="w-full aspect-square object-cover rounded-lg" />
          <p class="text-xs leading-relaxed text-gray-800">
            {{ feed.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
