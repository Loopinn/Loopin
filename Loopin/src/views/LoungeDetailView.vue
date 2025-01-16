<script setup>
import { onMounted, computed } from "vue";
import noImage from "../assets/images/noImage.svg";
import userProfile from "../assets/images/defaultprofile30.svg";
import { RouterLink, useRoute } from "vue-router";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";

const postStore = usePostStore();
const { loungePosts } = storeToRefs(postStore);
const { loadLoungePosts } = postStore;

const route = useRoute();
const postId = route.params.id;

const currentPost = computed(() => {
  return loungePosts.value.find((post) => post.id === postId);
});

onMounted(() => {
  loadLoungePosts();
  console.log("전체 데이터:", loungePosts);
  console.log("이미지 URL:", loungePosts.images);
});
</script>

<template>
  <div class="px-5 py-6 min-h-full w-full mx-auto pb-[64px] relative space-y-8">
    <!-- 게시물 카드 -->
    <div class="bg-white rounded-lg shadow-sm">
      <!-- 헤더 영역 -->
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-2">
          <img :src="userProfile" alt="프로필 이미지" class="w-8 h-8 rounded-full" />
          <span class="font-medium">이름</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="text-red-500">팔로우</button>
        </div>
      </div>

      <!-- 이미지 영역 -->
      <div class="aspect-square w-full bg-black">
        <img :src="currentPost?.images[0] || noImage" alt="게시물 이미지" class="w-full h-full object-cover" />
      </div>

      <!-- 게시물 정보 영역 -->
      <div class="p-4 bg-white rounded-b-lg">
        <!-- 하단 액션 버튼 영역 -->
        <div class="flex items-center gap-4 my-3">
          <button class="flex items-center gap-1">
            <img src="../assets/images/likeblack.svg" alt="좋아요" />
            <span>0</span>
          </button>
          <button class="flex items-center gap-1">
            <img src="../assets/images/comment.svg" alt="댓글" />
            <span>0</span>
          </button>
        </div>
        <p class="leading-relaxed text-gray-800 font-medium text-lg">
          {{ currentPost.description }}
        </p>
      </div>
    </div>
  </div>
</template>
