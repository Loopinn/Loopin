<script setup>
import { dayNames } from "@/constants/dayNames";
import { ref, defineProps, computed, onMounted, onBeforeMount } from "vue";
import calendar from "@/assets/images/calendar.svg";
import checkIcon from "@/assets/images/check.svg";
import likewhite_full from "@/assets/images/likewhite_full.svg";
import likewhite from "@/assets/images/likewhite.svg";
import supabase from "@/config/supabase";

import noProfile from "@/assets/images/no-profile.svg";
import { resizeImage } from "@/utils/resizeImage";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  channelName: {
    type: String,
  },
});

const socialingDate = ref(null);

const challengeDate = ref(null);
const challengeDiffDay = ref(null);

const participantImages = ref([]);

onBeforeMount(async () => {
  if (props.channelName === "소셜링") {
    console.log("postCard", props.post);

    socialingDate.value = formatDate(props.post.date);
  } else if (props.channelName === "챌린지") {
    console.log("challenge", props.post);

    challengeDate.value = formatDate(props.post.start_date);

    challengeDiffDay.value = diffDay(props.post.start_date, props.post.end_date);
  }

  for (const id of props.post.participants) {
    const { data: userData, error: userError } = await supabase
      .from("userinfo")
      .select("profile_img")
      .eq("id", id)
      .single();
    resizeProfile(userData.profile_img);
  }
});
//이미지 리사이즈
const resizeProfile = (imgUrl) => {
  const img = new Image();
  img.crossOrigin = "anonymous"; // CORS 설정 추가
  img.onload = () => {
    // 리사이징된 이미지 URL 얻기
    participantImages.value.push(resizeImage(img, 100, 100));
  };
  // 외부 URL에서 이미지 로드
  img.src = imgUrl;
};

// 날짜 포맷팅
const formatDate = (date) => {
  const newDate = new Date(date);

  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();

  const dayName = dayNames[newDate.getDay()];
  console.log(`${month}.${day}(${dayName})`);
  return `${month}.${day}(${dayName})`;
};

// 챌린지 시작, 종료날짜 차이 계산
const diffDay = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diff = (end - start) / (1000 * 60 * 60 * 24 * 7);
  console.log(diff.toFixed(0));

  return `${diff.toFixed(0)}주 간`;
};

const place_name = computed(() => {
  const placeString = props.post.place;

  function isJsonString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  if (isJsonString(placeString)) {
    return JSON.parse(placeString).place_name;
  } else return placeString;
});
// 좋아요 버튼
const like = ref(false);

const isLiked = () => {
  like.value = !like.value;
};
</script>
<template>
  <div class="h-[200px] flex rounded-2xl bg-white mb-6 cursor-pointer">
    <div class="relative">
      <img
        :src="post.images ? post.images[0] : ''"
        alt="thumbnail"
        class="w-40 h-40 rounded-2xl m-5 object-cover will-change-transform"
      />
      <button @click="isLiked">
        <img :src="like ? likewhite_full : likewhite" alt="like" class="absolute left-7 bottom-7 w-10 h-10" />
      </button>
    </div>

    <div class="w-[340px] h-[200px] mt-5 space-y-[6px]">
      <!-- 카테고리 태그 -->
      <div class="bg-[#F4F4F4] text-[#666060] rounded-3xl inline-block text-center text-4 px-2 py-1 mr-[6px]">
        {{ post.category }}
      </div>

      <p class="text-[24px] truncate ...">{{ post.title }}</p>
      <div v-if="props.channelName === '소셜링'" class="flex gap-1 text-[#999999]">
        <p>
          {{ post.type }}
        </p>
        <p class="flex items-center">
          <img src="@/assets/images/location_gray.svg" alt="location" class="inline-block mb-[2px]" /> {{ place_name }}
        </p>
        <p>· {{ socialingDate }}</p>
      </div>
      <div v-else-if="props.channelName === '클럽'" class="text-[#999999]">
        <p class="flex items-center">
          <img src="@/assets/images/location_gray.svg" alt="location" class="inline-block mb-[2px]" /> {{ place_name }}
        </p>
      </div>
      <div v-else class="text-[#999999] flex gap-1">
        <p><img :src="calendar" alt="calendar" class="inline" />{{ challengeDate }} ·</p>
        <p>{{ challengeDiffDay }}</p>
        <p class="flex gap-1"><img :src="checkIcon" alt="" class="w-[15px] mb-[2px]" /> {{ post.times_per_week }}</p>
      </div>
      <div class="flex items-center gap-1">
        <div class="flex -space-x-2">
          <template v-for="(img, index) in participantImages" :key="index">
            <img
              v-if="index < 4 || participantImages.length <= 5"
              :src="img || noProfile"
              alt="memberprofile"
              class="w-9 h-9 rounded-full border-2 border-white object-cover will-change-transform"
            />
            <div v-else class="relative w-9 h-9">
              <img
                :src="img || noProfile"
                alt="memberprofile"
                class="w-9 h-9 rounded-full border-2 border-white object-cover will-change-transform"
              />
              <img
                src="@/assets/images/more.svg"
                alt="more"
                class="absolute inset-0 w-9 h-9 rounded-full border-2 border-white bg-black bg-opacity-40"
              />
            </div>
          </template>
        </div>
        <img src="@/assets/images/members_gray.svg" alt="participants" />
        <p class="text-[#999999]">{{ post.participants ? post.participants.length : 0 }}/{{ post.max_people }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
