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
  likes.value = loungePosts.value.map((post) => ({ id: post.id, isLiked: post.likes.includes(userId) }));
};

const handleLike = debounce(async (postId) => {
  const userId = await getUserId();
  if(userId){
    const post = loungePosts.value.find((post) => post.id === postId);
    await feedLike(post, userId);
    likes.value = likes.value.map((like) => (like.id === postId ? { ...like, isLiked: !like.isLiked } : like));
    await loadLoungePosts();
  }else{
    isModalOpen.value = true;
  }
}, 300);

const toggleModal = () => {
  isModalOpen.value = false;
  router.push("/signIn");
};

onBeforeMount( () => {
   Promise.all([loadLoungePosts(), getUserId(), likeCheck()]);
});
</script>

<template>
  <div class="px-5 py-6 min-h-full w-full mx-auto pb-[64px] relative space-y-8 bg-[#f4f4f4]">
    <PageInfoSection
      :icon="loungeLogo"
      title="라운지"
      subtitle="비슷한 관심사를 가진
      멤버들의 취향 피드 구독하기"
      alt="라운지 로고"
      />
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="feed in loungePosts" :key="feed.id" class="space-y-2 relative">
          <RouterLink :to="{ path: `/lounge/${feed.id}` }">
            <div class="bg-gray-300 rounded-xl">
            <img
              :src="feed.images[0] || noImage"
              class="w-full aspect-square object-cover rounded-md"
              />
            </div>
          </RouterLink>
          <button class="absolute left-2 top-32 flex items-center" @click="handleLike(feed.id)">
            <img :src="likes.find((like) => like.id === feed.id)?.isLiked ? like : unlike" alt="좋아요" />
        </button>
        <p class="text-xs leading-relaxed text-gray-800 line-clamp">
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
