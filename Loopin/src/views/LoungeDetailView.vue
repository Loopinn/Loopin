<script setup>
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import { computed, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { usePostStore } from "@/stores/postStore";
import DetailComment from "@/components/lounge/DetailComment.vue";
import WriteButton from "@/components/lounge/WriteButton.vue";
import noImage from "../assets/images/noImage.svg";
import userProfile from "../assets/images/defaultprofile30.svg";

const postStore = usePostStore();
const { loungePosts } = storeToRefs(postStore);
const { loadLoungePosts } = postStore;

const route = useRoute();
const postId = route.params.id;

const currentPost = computed(() => {
  return loungePosts.value.find((post) => post.id === postId);
});

onBeforeMount(() => {
  loadLoungePosts();
  console.log("전체 데이터:", loungePosts);
  console.log("이미지 URL:", loungePosts.images);
});
</script>

<template>
  <div class="px-5 py-6 min-h-screen w-full mx-auto pb-[64px] relative space-y-8 bg-[#f4f4f4]">
    <!-- 게시물 카드 -->
    <div class="">
      <!-- 헤더 영역 -->
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-2">
          <img :src="userProfile" alt="프로필 이미지" class="w-8 h-8 rounded-full" />
          <span class="font-medium">{{ currentPost.creator }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="text-red-500 font-bold">팔로우</button>
        </div>
      </div>

      <!-- 이미지 영역 -->
      <div class="aspect-square w-full relative z-0" v-if="currentPost?.images.length >= 1">
        <Swiper
          :modules="[Navigation, Pagination]"
          :slides-per-view="1"
          :navigation="true"
          :pagination="{ clickable: true }"
          class="h-full w-full"
        >
          <SwiperSlide v-for="(image, index) in currentPost?.images" :key="index" class="aspect-square">
            <img :src="image || noImage" alt="게시물 이미지" class="w-full h-full object-cover rounded-xl" />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- 게시물 정보 영역 -->
      <div class="p-4 rounded-b-lg">
        <div
          v-if="currentPost?.category"
          class="text-black bg-white text-[14px] rounded-2xl inline-block px-2 py-1 mr-[6px] mb-2 border border-gray-300"
        >
          {{ currentPost.category }}
        </div>
        <!-- 하단 액션 버튼 영역 -->
        <div class="flex items-center gap-4 my-3">
          <button class="flex items-center gap-1">
            <img src="../assets/images/likeblack.svg" alt="좋아요" />
            <span>{{ currentPost?.likes?.length || "0" }}</span>
          </button>
          <button class="flex items-center gap-1">
            <img src="../assets/images/comment.svg" alt="댓글" />
            <span>{{ (currentPost.comments && currentPost.comments.length) || "0" }}</span>
          </button>
        </div>
        <p class="leading-relaxed text-gray-800 font-medium text-lg">
          {{ currentPost.description }}
        </p>
      </div>
      <DetailComment :post-id="currentPost.id" />
    </div>
    <WriteButton />
  </div>
</template>

<style>
.swiper-button-next,
.swiper-button-prev {
  background-color: rgba(47, 47, 47, 0.5);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  --swiper-navigation-size: 15px;
}
</style>
