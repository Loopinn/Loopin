<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
import { joinChallenge } from "@/utils/joinChallenge";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import supabase from "@/config/supabase";
import { ref, computed, onBeforeMount, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/Loading.vue";
import { resizeImage } from "@/utils/resizeImage";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const postStore = usePostStore();
const { challengePosts } = storeToRefs(postStore);
const { loadChallengePosts } = postStore;

const router = useRouter();
const route = useRoute();
const postId = route.params.id;

const userData = ref(null);
const userId = ref("");
const isLoading = ref(false);

const getUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  userId.value = sessionData?.session?.user?.id || "";
  return sessionData?.session?.user?.id;
};

const currentPost = computed(() => {
  return challengePosts.value.find((post) => post.id === postId);
});

const fetchData = async () => {
  isLoading.value = true;
  if (currentPost.value && currentPost.value.creator) {
    try {
      // Supabase에서 작성자 정보 가져오기
      const { data: userDataFromDB, error: userError } = await supabase
        .from("userinfo")
        .select()
        .eq("id", currentPost.value.creator)
        .single();

      if (userError) {
        return;
      }

      if (userDataFromDB) {
        userData.value = userDataFromDB;
        resizeProfile(userData.value.profile_img);
      }
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  }
};

const handleUpdateParticipants = (updatedParticipants) => {
  currentPost.value.participants = updatedParticipants;
};

onMounted(async () => {
  await getUserId();
  await fetchData();
});

// currentPost가 변경될 때마다 자동으로 실행
watchEffect(() => {
  if (currentPost.value && currentPost.value?.creator) {
    fetchData();
  }
});

onBeforeMount(() => {
  loadChallengePosts();
});

const formattedDate = (dateString) => {
  const [_, month, day] = dateString.split("-");

  const date = new Date(dateString);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = weekdays[date.getDay()];

  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");

  return `${formattedMonth}.${formattedDay}(${dayOfWeek})`;
};
const startDate = computed(() => {
  return formattedDate(currentPost.value.start_date);
});

const endDate = computed(() => {
  return formattedDate(currentPost.value.end_date);
});

const period = computed(() => {
  const start = new Date(currentPost.value.start_date);
  const end = new Date(currentPost.value.end_date);

  return (end - start) / (1000 * 60 * 60 * 24) + 1;
});

//프로필 이미지 리사이즈
const resizedProfile = ref(null);
const resizeProfile = (imgUrl) => {
  if (!imgUrl) {
    resizedProfile.value = null;
    return;
  }
  if (imgUrl && imgUrl.includes("k.kakaocdn.net")) {
    resizedProfile.value = imgUrl;
    return;
  }
  const img = new Image();
  img.crossOrigin = "anonymous"; // CORS 설정 추가
  img.onload = () => {
    // 리사이징된 이미지 URL 얻기
    resizedProfile.value = resizeImage(img, 200, 200);
  };
  // 외부 URL에서 이미지 로드
  img.src = imgUrl;
};

const formatFeeInfo = (fee) => {
  switch (fee) {
    case "contentFee":
      return "콘텐츠 제작비";
    case "hostFee":
      return "호스트 수고비";
    case "noshowFee":
      return "노쇼 방지비";
    case "rentalFee":
      return "대관료";
    case "materialFee":
      return "재료비";
    case "dessertFee":
      return "다과비";
  }
};

const isLiked = ref(false);

const updateLikeStatus = (isLikedNow) => {
  isLiked.value = isLikedNow;
};
</script>
<template>
  <Loading v-if="isLoading" />
  <div v-if="currentPost" class="mx-auto w-[600px] relative">
    <div class="w-full relative z-0 bg-white rounded-xl">
      <Swiper
        :loop="true"
        :modules="[Navigation, Pagination, Autoplay]"
        :slides-per-view="1"
        :autoplay="{
          delay: 4000,
        }"
        :navigation="true"
        :pagination="{ clickable: true }"
        class="w-full h-[260px]"
      >
        <SwiperSlide v-for="(image, index) in currentPost.images" :key="index">
          <img :src="image || noImage" alt="게시물 이미지" class="w-full h-full object-cover" />
        </SwiperSlide>
      </Swiper>
    </div>
    <div class="absolute top-3 left-3 flex gap-2">
      <div class="text-[14px] rounded-[16px] bg-[#D9D9D9] px-2 py-1">{{ currentPost.category }}</div>
    </div>
    <div v-if="userData" class="bg-white w-[440px] h-[105px] top-[205px] left-[80px] absolute rounded-[20px]">
      <img
        v-if="resizedProfile"
        @click="router.push(`/user/${userData.nickname}`)"
        :src="resizedProfile"
        alt="hostprofile"
        class="w-[60px] h-[60px] rounded-full absolute left-[190px] top-[-30px] object-cover cursor-pointer"
      />
      <img
        v-else
        @click="router.push(`/user/${userData.nickname}`)"
        src="@/assets/images/no-profile.svg"
        alt="hostprofile"
        class="w-[60px] h-[60px] rounded-full absolute left-[190px] top-[-30px] cursor-pointer"
      />
      <div class="text-center mt-[30px]">
        <p class="text-[12px] mb-1">{{ userData.nickname }}</p>
        <p class="text-[20px] font-bold px-[15px] line-clamp-1">{{ currentPost.title }}</p>
      </div>
    </div>
    <!-- 한줄 요약 -->
    <div class="bg-[#f1f1f1] min-h-[calc(100vh - 193px)] pb-[120px]">
      <div class="pt-[50px]">
        <div class="text-center text-[#403F3F] mt-2">
          <img src="@/assets/images/calendar.svg" alt="calendar" class="inline-block" />
          <span class="mr-2">{{ startDate }} {{ period / 7 }}주 간</span>
          <img
            src="@/assets/images/check-circle.svg"
            alt="check"
            class="inline-block mb-[2px] mr-1"
            style="filter: invert(23%) sepia(15%) saturate(21%) hue-rotate(83deg) brightness(101%) contrast(97%)"
          />
          <span class="mr-2">{{ currentPost.times_per_week }}</span>
          <img
            src="@/assets/images/members.svg"
            alt="membercount"
            class="inline-block mb-[2px] mr-1"
            style="filter: invert(23%) sepia(15%) saturate(21%) hue-rotate(83deg) brightness(101%) contrast(97%)"
          />
          <span>{{ currentPost.participants ? currentPost.participants.length : 1 }}/{{ currentPost.max_people }}</span>
        </div>
        <div class="ml-[40px] mt-[70px] w-[520px]">
          <div class="break-words whitespace-pre-wrap">{{ currentPost.description }}</div>
          <!-- 멤버 소개 -->
          <MemberInfo :participants="currentPost.participants || []" :pageType="'challenge'" />
          <!-- 안내사항 -->
          <div class="mt-5">
            <div class="text-[#46A7CD]">안내사항</div>
            <div class="font-bold">자세한 정보를 알려드릴게요</div>
            <div class="mt-2">
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/category.svg" alt="category" />

                <router-link :to="`/challenge/${currentPost.subject}/전체`" class="underline">{{
                  currentPost.subject
                }}</router-link>
                <span v-if="currentPost.subject"> > </span>
                <router-link :to="`/challenge/${currentPost.subject}/${currentPost.category}`" class="underline">{{
                  currentPost.category
                }}</router-link>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/members.svg" alt="members" />
                <p>
                  {{ currentPost.participants ? currentPost.participants.length : 1 }}/{{ currentPost.max_people }}명
                  선착순
                </p>
              </div>
              <div v-if="currentPost.fee !== 0" class="flex gap-1 mb-1">
                <img src="@/assets/images/won.svg" alt="fee" />
                <p>{{ currentPost.fee }}원</p>
              </div>
              <div v-if="currentPost.fee_info.length > 0" class="flex gap-1 mb-1">
                <img src="@/assets/images/info-circle.svg" alt="feeinfo" />
                <span v-for="(info, index) in currentPost.fee_info" :key="index">{{ formatFeeInfo(info) }}</span>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/calendar.svg" alt="calendar" />
                <p>{{ period / 7 }}주 간 진행 - {{ startDate }} ~ {{ endDate }}</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/stamp.svg" alt="stamp" class="mb-[2px]" />
                <p>{{ currentPost.times_per_week }} 인증</p>
              </div>
            </div>
          </div>
          <!-- 댓글 -->
          <Comment
            :comment="currentPost.comments"
            :postId="currentPost.id"
            :pageType="'challenge'"
            :currentPost="currentPost"
            :userId="userId"
            :isLiked="isLiked"
            @updateLike="updateLikeStatus"
          />
        </div>
      </div>
      <!-- 참여하기 -->
      <Register
        :title="currentPost.title"
        :currentPost="currentPost"
        :pageType="'challenge'"
        :userId="userId"
        :action="joinChallenge"
        :isLiked="isLiked"
        :creator="currentPost?.creator"
        @updateParticipants="handleUpdateParticipants"
        @updateLike="updateLikeStatus"
      />
    </div>
  </div>
</template>
<style scoped>
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  background-color: #ffffffcc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 11px;
  color: #3498d0 !important;
}

:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  font-size: 17px;
  font-weight: bold;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #3498d0 !important;
}
</style>
