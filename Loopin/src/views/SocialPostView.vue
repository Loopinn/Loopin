<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
import { joinSocialing } from "@/utils/joinSocialing";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import supabase from "@/config/supabase";
import { ref, computed, onBeforeMount, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/Loading.vue";
import MoreModal from "@/components/lounge/MoreModal.vue";
import { resizeImage } from "@/utils/resizeImage";

const postStore = usePostStore();
const { socialingPosts } = storeToRefs(postStore);
const { loadSocialPosts } = postStore;

const router = useRouter();
const route = useRoute();
const postId = route.params.id;

const userData = ref(null);
const userId = ref("");
const isLoading = ref(false);

const isModalOpen = ref(false);

const isUserInClub = ref(false);

const getUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("내 아이디: ", sessionData?.session?.user?.id);
  userId.value = sessionData?.session?.user?.id || "";
  return sessionData?.session?.user?.id;
};

const currentPost = computed(() => {
  return socialingPosts.value.find((post) => post.id === postId);
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
        console.log("유저 데이터를 가져오는 중 에러 발생", userError);
        return;
      }

      if (userDataFromDB) {
        userData.value = userDataFromDB;
        resizeProfile(userData.value.profile_img);
      }
    } catch (error) {
      console.log("알 수 없는 오류 발생: ", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    console.log("작성자 ID가 없습니다.");
  }
};

onMounted(async () => {
  console.log("현재 게시글", currentPost.value);
  await getUserId();
  await fetchData();
});

// currentPost가 변경될 때마다 자동으로 실행
watchEffect(async () => {
  if (currentPost.value && currentPost.value?.creator) {
    fetchData();

    if (currentPost.value.for_club) {
      const { data, error } = await supabase.from("club_posts").select().eq("id", currentPost.value.for_club);
      if (data) {
        const clubParticipants = data[0].participants;
        isUserInClub.value = clubParticipants.includes(userId.value);
      }
    }
  }
});

onBeforeMount(() => {
  loadSocialPosts();
  console.log(currentPost.value); // 현재 게시물 출력
});

const formattedDate = computed(() => {
  const dateString = currentPost.value.date;

  const [year, month, day] = dateString.split("-");

  const date = new Date(dateString);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = weekdays[date.getDay()];

  const formattedYear = year.slice(-2);
  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");

  return `${formattedYear}.${formattedMonth}.${formattedDay}(${dayOfWeek})`;
});

const place_name = computed(() => {
  const placeString = currentPost.value.place;

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

const formattedTime = computed(() => {
  const timeString = currentPost.value.time;
  const timeObject = JSON.parse(timeString);

  let hours = timeObject.hours;
  const ampm = hours >= 12 ? "오후" : "오전";

  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = timeObject.minutes.toString().padStart(2, "0");

  return `${ampm} ${formattedHours}:${formattedMinutes}`;
});

const handleUpdateParticipants = (updatedParticipants) => {
  currentPost.value.participants = updatedParticipants;
};
const openModal = () => {
  isModalOpen.value = true;
};

const formatPlace = (place) => {
  if (place === "온라인") return place;
  const parsedPlace = JSON.parse(place);
  const placeName = parsedPlace.road_address_name || parsedPlace.address_name;
  return placeName.split(" ")[1];
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

//프로필 이미지 리사이즈
const resizedProfile = ref(null);
const resizeProfile = (imgUrl) => {
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

const openKakaoMap = () => {
  const kakaoMapUrl = `https://map.kakao.com/link/map/${JSON.parse(currentPost.value.place).id}`;
  window.open(kakaoMapUrl, "_blank");
};
const isLiked = ref(false);

const updateLikeStatus = (isLikedNow) => {
  isLiked.value = isLikedNow;
};
</script>

<template>
  <MoreModal :isModalOpen="isModalOpen" :postId="postId" @close="isModalOpen = false" />
  <Loading v-if="isLoading" />
  <div v-if="currentPost" class="mx-auto w-[600px] relative">
    <img class="w-full h-[260px] object-cover" :src="currentPost.images ? currentPost.images[0] : ''" alt="thumbnail" />
    <div class="absolute top-3 left-3 flex gap-2">
      <div class="text-[14px] rounded-[16px] bg-[#D9D9D9] px-2 py-1">{{ currentPost.category }}</div>
      <div v-if="currentPost.for_club" class="text-[14px] text-white rounded-[16px] bg-[#1C8A6A] px-2 py-1">
        클럽소셜링
      </div>
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
      <div class="text-center mt-[30px] px-[15px]">
        <p class="text-[12px] mb-1">{{ userData.nickname }}</p>
        <p class="text-[20px] font-bold line-clamp-1">{{ currentPost.title }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2 absolute right-[40px]">
      <button v-if="currentPost.creator === userId" @click="openModal">
        <img src="@/assets/images/more-black.svg" alt="더보기" />
      </button>
    </div>
    <!-- 한줄 요약 -->
    <div class="bg-[#f1f1f1] min-h-screen pb-[120px]">
      <div class="pt-[50px]">
        <div class="text-center text-[#403F3F] mt-2">
          <img src="@/assets/images/calendar.svg" alt="calendar" class="inline-block" />
          <span>{{ place_name }} · {{ formattedDate }} {{ formattedTime }} </span>
          <img src="@/assets/images/star.svg" alt="star" class="ml-2 inline-block" />
          <span class="text-[#FFC508]">5.0 </span>
          <span class="text-[#909090]">(44)</span>
        </div>
        <div class="ml-[40px] mt-[70px] w-[520px]">
          <div>{{ currentPost.description }}</div>
          <!-- 멤버 소개 -->
          <MemberInfo :participants="currentPost.participants || []" :pageType="'socialing'" />
          <!-- 안내사항 -->
          <div class="mt-5">
            <p class="text-[#FF0000]">안내사항</p>
            <p>자세한 정보를 알려드릴게요</p>
            <div class="mt-2">
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/category.svg" alt="category" />

                <router-link to="#" class="underline">{{ currentPost.subject }}</router-link>
                <span> > </span>
                <router-link to="#" class="underline">{{ currentPost.category }}</router-link>
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
                <p>모임날짜 · {{ formattedDate }} {{ formattedTime }}</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/location.svg" alt="location" />
                <span>
                  {{ place_name }}
                </span>
                <span v-if="currentPost.place !== '온라인'"
                  >({{
                    JSON.parse(currentPost.place).road_address_name || JSON.parse(currentPost.place).address_name
                  }})</span
                >
              </div>
              <div
                v-if="currentPost.place !== '온라인'"
                @click="openKakaoMap"
                class="flex cursor-pointer border rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 overflow-hidden"
              >
                <img src="@/assets/images/location-map.svg" alt="location-map" />
                <div class="p-4">
                  <p>{{ JSON.parse(currentPost.place).place_name }}</p>
                  <p class="text-[14px] text-[#403F3F]">
                    {{ JSON.parse(currentPost.place).road_address_name || JSON.parse(currentPost.place).address_name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- 댓글 -->
          <Comment
            :comment="currentPost.comments || []"
            :postId="currentPost.id"
            :pageType="'socialing'"
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
        :pageType="'socialing'"
        :userId="userId"
        :action="joinSocialing"
        :isUserInClub="isUserInClub"
        :clubId="currentPost?.for_club"
        :isLiked="isLiked"
        @updateParticipants="handleUpdateParticipants"
        @updateLike="updateLikeStatus"
      />
    </div>
  </div>
</template>
<style scoped></style>
