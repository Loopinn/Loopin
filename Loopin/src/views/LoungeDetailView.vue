<script setup>
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import supabase from "@/config/supabase";
import { debounce } from "lodash";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import { computed, onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "@/stores/postStore";
import { feedLike } from "@/utils/feedLike";
import DetailComment from "@/components/lounge/DetailComment.vue";
import WriteButton from "@/components/lounge/WriteButton.vue";
import noImage from "@/assets/images/noImage.svg";
import userProfile from "@/assets/images/defaultprofile30.svg";
import more from "@/assets/images/more-black.svg";
import MoreModal from "@/components/lounge/MoreModal.vue";
import Loading from "@/components/Loading.vue";
import like from "../assets/images/likeblack_full.svg";
import unlike from "../assets/images/likeblack.svg";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const { loungePosts } = storeToRefs(postStore);
const { loadLoungePosts } = postStore;

const isModalOpen = ref(false);
const postId = route.params.id;
const userId = ref(null);
const isMoreModalOpen = ref(false);
const nickname = ref(null);
const profileImage = ref(null);
const isLike = ref(null);
const isLoading = ref(true);

const currentPost = computed(() => {
  return loungePosts.value.find((post) => post.id === postId);
});

const fetchUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  return sessionData?.session?.user?.id;
};

const handleLike = debounce(async () => {
  const userIdValue = await fetchUserId();
  if(userIdValue){
    const post = loungePosts.value.find((post) => post.id === postId);
    await feedLike(post, userIdValue);
    await loadLoungePosts();
    likeCheck();
  }else{
    isModalOpen.value = true;
  }
}, 300);

const likeCheck = async () => {
  const userIdValue = await fetchUserId();
  isLike.value = currentPost.value.likes.includes(userIdValue);
};

async function fetchData() {
  await loadLoungePosts();
  console.log("currentPost",loungePosts.value.find((post) => post.id === postId))
  const { data, error } = await supabase
  .from("userinfo")
  .select()
  .eq("id", loungePosts.value.find((post) => post.id === postId).creator);
  
  if (data && data.length > 0) {
    nickname.value = data[0].nickname;
    userId.value = data[0].id;
    profileImage.value = data[0].profile_img;
  }
  userId.value = await fetchUserId();
  isLoading.value = false;
}

function openMoreModal() {
  isMoreModalOpen.value = true;
}

const toggleModal = () => {
  isModalOpen.value = false;
  router.push("/signIn");
};

onBeforeMount(async () => {
  await loadLoungePosts();
  await fetchData();
  await likeCheck();
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-if="!isLoading" class="py-0 min-h-screen w-full pb-[1px] relative space-y-8 bg-[#f4f4f4]">
    <!-- 게시물 카드 -->
    <div class="">
      <!-- 헤더 영역 -->
      <div class="flex items-center justify-between py-4 px-4">
        <div class="flex items-center gap-2">
          <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <img :src="profileImage || userProfile" alt="프로필 이미지" class="w-12 h-12 rounded-full" />
          </div>
          <span class="font-bold">{{ nickname }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="userId !== currentPost.creator" class="text-[#f43630] font-semibold text-sm">팔로우</button>
          <button v-else @click="openMoreModal"><img :src="more" alt="더보기" /></button>
        </div>
      </div>

      <!-- 이미지 영역 -->
      <div class="aspect-square w-full relative z-0 bg-gray-300" v-if="currentPost?.images.length >= 1">
        <Swiper
          :modules="[Navigation, Pagination]"
          :slides-per-view="1"
          :navigation="true"
          :pagination="{ clickable: true }"
          class="h-full w-full"
        >
          <SwiperSlide v-for="(image, index) in currentPost?.images" :key="index" class="aspect-square">
            <img :src="image || noImage" alt="게시물 이미지" class="w-full h-full object-cover " />
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
        <p class="leading-relaxed text-gray-800 font-medium text-lg">
          {{ currentPost.description }}
        </p>
        <div class="flex items-center gap-4 my-3">
          <button class="flex items-center gap-1" @click="handleLike">
            <img :src="isLike ? like : unlike" alt="좋아요" />
            <span>{{ currentPost?.likes?.length || "0" }}</span>
          </button>
          <button class="flex items-center gap-1">
            <img src="../assets/images/comment.svg" alt="댓글" />
            <span>{{ (currentPost.comments && currentPost.comments.length) || "0" }}</span>
          </button>
        </div>
      </div>
      <!-- <DetailComment :post-id="currentPost.id" /> -->
    </div>
    <WriteButton />
    <MoreModal :isModalOpen="isMoreModalOpen" :postId="postId" @close="isMoreModalOpen = false" />
  </div>
  <ConfirmModal :isOpen="isModalOpen" :message="'로그인이 필요합니다.'" :buttonMessage="'확인'" @close="toggleModal">
  </ConfirmModal>
</template>

<style>
.swiper-button-next,
.swiper-button-prev {
  color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>
