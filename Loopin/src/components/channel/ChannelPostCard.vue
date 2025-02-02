<script setup>
import { dayNames } from "@/constants/dayNames";
import { ref, defineProps, computed, onBeforeMount } from "vue";
import calendar from "@/assets/images/calendar.svg";
import checkIcon from "@/assets/images/check.svg";
import like from "@/assets/images/likewhite_full.svg";
import unlike from "@/assets/images/likewhite.svg";
import { channelLike } from "@/utils/channelLike";
import { debounce } from "lodash";
import ConfirmModal from "../modal/ConfirmModal.vue";
import supabase from "@/config/supabase";
import noProfile from "@/assets/images/no-profile.svg";
import { resizeImage } from "@/utils/resizeImage";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  channelName: {
    type: String,
  },
});

const authStore = useAuthStore();
const { loginUser } = storeToRefs(authStore);

const socialingDate = ref(null);

const challengeDate = ref(null);
const challengeDiffDay = ref(null);

const participantImages = ref([]);

onBeforeMount(async () => {
  if (props.channelName === "소셜링") {
    socialingDate.value = formatDate(props.post.date);
  } else if (props.channelName === "챌린지") {
    challengeDate.value = formatDate(props.post.start_date);
    challengeDiffDay.value = diffDay(props.post.start_date, props.post.end_date);
  }

  // 순서를 유지하기 위해 미리 배열을 초기화
  participantImages.value = new Array(props.post.participants.length).fill(null);

  await Promise.all(
    props.post.participants.map(async (id, index) => {
      const { data: userData, error: userError } = await supabase
        .from("userinfo")
        .select("profile_img")
        .eq("id", id)
        .single();

      if (userData) {
        resizeProfile(userData.profile_img, index);
      }
    }),
  );
});
// 이미지를 순서대로 저장
const resizeProfile = (imgUrl, index) => {
  if (!imgUrl) {
    participantImages.value[index] = null;
    return;
  }

  if (imgUrl && imgUrl.includes("k.kakaocdn.net")) {
    participantImages.value[index] = imgUrl;
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    participantImages.value[index] = resizeImage(img, 100, 100);
  };
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

// 좋아요
const isModalOpen = ref(false);
const isLiked = ref(false);

const tables = {
  소셜링: "socialing_posts",
  클럽: "club_posts",
  챌린지: "challenge_posts",
};
const table = (channelName) => tables[channelName] || null;

const likeCheck = async () => {
  if (loginUser.value) {
    const { data: userData, error: userDataError } = await supabase
      .from("userinfo")
      .select("postLikes")
      .eq("id", loginUser.value.id)
      .single();

    console.log(userData);

    if (userDataError) {
      console.error(userDataError);
    }

    const likedPosts = userData?.postLikes ? userData.postLikes.map((item) => JSON.parse(item)) : [];
    isLiked.value = likedPosts.some((post) => post.id === props.post.id);
  }
};

const handleLike = debounce(async (event) => {
  const tableName = table(props.channelName);

  if (loginUser.value) {
    const post = props.post;
    await channelLike(post, loginUser.value.id, tableName);
    isLiked.value = !isLiked.value;
  } else {
    isModalOpen.value = true;
  }
}, 300);

const toggleModal = () => {
  isModalOpen.value = false;
  router.push("/signIn");
};

onBeforeMount(() => {
  likeCheck();
});
</script>
<template>
  <div class="h-[200px] flex rounded-2xl bg-white mb-6 cursor-pointer">
    <div class="relative">
      <img :src="post.images ? post.images[0] : ''" alt="thumbnail" class="w-40 h-40 rounded-2xl m-5 object-cover" />
      <button v-if="loginUser" @click.stop.prevent="(event) => handleLike(event)">
        <img :src="isLiked ? like : unlike" alt="like" class="absolute left-7 bottom-7 w-10 h-10" />
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
          <template v-for="(img, index) in participantImages.slice(0, 5)" :key="index">
            <div v-if="index === 4 && participantImages.length > 5" class="relative w-9 h-9">
              <!-- 5번째 프로필 이미지 -->
              <img
                :src="img || noProfile"
                alt="memberprofile"
                class="w-9 h-9 rounded-full border-2 border-white object-cover"
              />
              <!-- '더보기(more)' 이미지 오버레이 -->
              <img
                src="@/assets/images/more.svg"
                alt="more"
                class="absolute inset-0 w-9 h-9 rounded-full border-2 border-white bg-black bg-opacity-40"
              />
            </div>
            <img
              v-else
              :src="img || noProfile"
              alt="memberprofile"
              class="w-9 h-9 rounded-full border-2 border-white object-cover"
            />
          </template>
        </div>
        <img src="@/assets/images/members_gray.svg" alt="participants" />
        <p class="text-[#999999]">{{ post.participants ? post.participants.length : 0 }}/{{ post.max_people }}</p>
      </div>
    </div>
  </div>

  <ConfirmModal :isOpen="isModalOpen" :message="'로그인이 필요합니다.'" :buttonMessage="'확인'" @close="toggleModal" />
</template>
<style scoped></style>
