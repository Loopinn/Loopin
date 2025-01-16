<script setup>
import { onMounted } from "vue";
import PageInfoSection from "@/components/common/PageInfoSection.vue";
import loungeLogo from "../assets/images/loungLogo.svg";
import noImage from "../assets/images/noImage.svg";
import { RouterLink } from "vue-router";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import WriteButton from "@/components/lounge/writeButton.vue";

const postStore = usePostStore();
const { loungePosts } = storeToRefs(postStore);
const { loadLoungePosts } = postStore;
onMounted(() => {
  loadLoungePosts();
});
</script>

<template>
  <div class="px-5 py-6 min-h-full w-full mx-auto pb-[64px] relative space-y-8">
    <PageInfoSection
      :icon="loungeLogo"
      title="라운지"
      subtitle="비슷한 관심사를 가진
        멤버들의 취향 피드 구독하기"
      alt="라운지 로고"
    />
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="feed in loungePosts" :key="feed.id" class="space-y-2">
        <RouterLink :to="{ path: `/lounge/${feed.id}` }">
          <img
            :src="feed.images[0] || noImage"
            :alt="feed.description"
            class="w-full aspect-square object-cover rounded-lg"
          />
        </RouterLink>
        <p class="text-xs leading-relaxed text-gray-800">
          {{ feed.description }}
        </p>
      </div>
    </div>
    <WriteButton />
  </div>
</template>
