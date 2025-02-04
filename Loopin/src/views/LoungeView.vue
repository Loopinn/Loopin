<script setup>
import supabase from "@/config/supabase";
import { ref, onBeforeMount } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { debounce } from "lodash";
import { feedLike } from "@/utils/feedLike";
import PageInfoSection from "@/components/common/PageInfoSection.vue";
import WriteButton from "@/components/lounge/WriteButton.vue";
import loungeLogo from "../assets/images/loungeLogo.svg";
import noImage from "../assets/images/noImage.svg";
import like from "../assets/images/likewhite_full.svg";
import unlike from "../assets/images/likewhite.svg";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

const router = useRouter();

const postStore = usePostStore();

const { loungePosts } = storeToRefs(postStore);
const { loadLoungePosts } = postStore;

const isModalOpen = ref(false);
const likes = ref([]);

const getUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  return sessionData?.session?.user?.id;
};

const likeCheck = async () => {
  const userId = await getUserId();
  likes.value = loungePosts.value.map((post) => ({
    id: post.id,
    isLiked: post.likes ? post.likes.includes(userId) : false,
  }));
};

const handleLike = debounce(async (postId) => {
  const userId = await getUserId();
  if (userId) {
    const post = loungePosts.value.find((post) => post.id === postId);
    await feedLike(post, userId);
    likes.value = likes.value.map((like) => (like.id === postId ? { ...like, isLiked: !like.isLiked } : like));
    await loadLoungePosts();
  } else {
    isModalOpen.value = true;
  }
}, 300);

const toggleModal = () => {
  isModalOpen.value = false;
  router.push("/signIn");
};

onBeforeMount(() => {
  Promise.all([loadLoungePosts(), getUserId(), likeCheck()]);
});
</script>

<template>
  <div class="w-full mx-auto relative space-y-4 bg-[#f4f4f4] mb-4">
    <div class="py-6">
      <PageInfoSection
        :icon="loungeLogo"
        title="라운지"
        subtitle="비슷한 관심사를 가진
      멤버들의 취향 피드 구독하기"
        alt="라운지 로고"
      />
    </div>
    <div class="grid grid-cols-3 gap-2 px-7 bg-white rounded-t-[80px]">
      <div class="col-span-3 flex justify-center items-center">
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <line x1="10" y1="20" x2="90" y2="20" stroke="black" stroke-width="2" />
          <line x1="10" y1="25" x2="90" y2="25" stroke="black" stroke-width="2" />
          <line x1="10" y1="30" x2="90" y2="30" stroke="black" stroke-width="2" />
        </svg>
      </div>
      <div v-for="feed in loungePosts" :key="feed.id" class="relative">
        <RouterLink :to="{ path: `/lounge/${feed.id}` }">
          <img :src="feed.images[0] || noImage" class="w-full rounded-2xl aspect-square object-cover" />
        </RouterLink>

        <div class="absolute bottom-14 left-3">
          <button class="flex items-center" @click="handleLike(feed.id)">
            <img :src="likes.find((like) => like.id === feed.id)?.isLiked ? like : unlike" alt="좋아요" />
          </button>
        </div>

        <p class="text-xs leading-relaxed text-gray-800 line-clamp pl-2 mt-1">
          {{ feed.description }}
        </p>
      </div>
    </div>
    <WriteButton />
  </div>
  <ConfirmModal :isOpen="isModalOpen" :message="'로그인이 필요합니다.'" :buttonMessage="'확인'" @close="toggleModal">
  </ConfirmModal>
</template>

<style scoped>
.line-clamp {
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-height: calc(2 * 1.6em);
}
</style>
