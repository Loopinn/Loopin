<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
import { joinClub } from "@/utils/joinClub";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import supabase from "@/config/supabase";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onBeforeMount, onMounted, watchEffect } from "vue";
import MoreModal from "@/components/lounge/MoreModal.vue";
import { resizeImage } from "@/utils/resizeImage";

const postStore = usePostStore();
const { clubPosts } = storeToRefs(postStore);
const { loadClubPosts } = postStore;

const router = useRouter();
const route = useRoute();
const postId = route.params.id;

const userData = ref(null);
const userId = ref("");
const isLoading = ref(false);

const isModalOpen = ref(false);

const getUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("내 아이디: ", sessionData?.session?.user?.id);
  userId.value = sessionData?.session?.user?.id || "";
  return sessionData?.session?.user?.id;
};

const currentPost = computed(() => {
  return clubPosts.value.find((post) => post.id === postId);
});

const addressName = computed(() => {
  if (currentPost.value?.place === "온라인") {
    return "온라인";
  }
  const placeObj = currentPost.value?.place ? JSON.parse(currentPost.value.place) : null;
  return placeObj.place_name;
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
        resizeProfile();
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

const handleUpdateParticipants = (updatedParticipants) => {
  currentPost.value.participants = updatedParticipants;
};

const openModal = () => {
  isModalOpen.value = true;
};

onMounted(async () => {
  console.log("현재 게시글", currentPost.value);
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
  loadClubPosts();
  console.log(currentPost.value); // 현재 게시물 출력
});

//프로필 이미지 리사이즈
const resizedProfile = ref(null);
const resizeProfile = () => {
  const img = new Image();
  img.crossOrigin = "anonymous"; // CORS 설정 추가
  img.onload = () => {
    // 리사이징된 이미지 URL 얻기
    resizedProfile.value = resizeImage(img, 200, 200);
  };
  // 외부 URL에서 이미지 로드
  img.src = userData.value.profile_img;
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
  <div v-if="currentPost" class="mx-auto w-[600px] relative">
    <MoreModal :isModalOpen="isModalOpen" :postId="postId" @close="isModalOpen = false" />
    <img class="w-full h-[260px] object-cover" :src="currentPost.images ? currentPost.images[0] : ''" alt="thumbnail" />
    <div class="absolute top-3 left-3 flex gap-2">
      <div class="text-[14px] rounded-[16px] bg-[#D9D9D9] px-2 py-1">{{ currentPost.category }}</div>
    </div>
    <div class="bg-[#f1f1f1] min-h-screen pb-[120px] pt-11">
      <div class="ml-[40px] w-[520px]">
        <div v-if="userData" class="flex gap-4 relative">
          <div @click="router.push(`/user/${userData.nickname}`)" class="cursor-pointer">
            <img
              v-if="resizedProfile"
              :src="resizedProfile"
              alt="hostprofile"
              class="w-[60px] h-[60px] rounded-full object-cover"
            />
            <img v-else src="@/assets/images/no-profile.svg" alt="hostprofile" class="w-[60px] h-[60px] rounded-full" />
          </div>
          <div class="mt-1 flex flex-col justify-center">
            <p class="text-[20px] font-bold mb-1">{{ currentPost.title }}</p>
            <p class="text-[12px]">
              호스트 <b>{{ userData.nickname }}</b>
            </p>
          </div>
          <div class="flex items-center gap-2 absolute right-0">
            <button v-if="currentPost.creator === userId" @click="openModal">
              <img src="@/assets/images/more-black.svg" alt="더보기" />
            </button>
          </div>
        </div>

        <div class="mt-2">
          <img src="@/assets/images/members_gray.svg" alt="memberscount" class="inline-block" />
          <span class="ml-1 text-[12px] text-[#403F3F]"
            >{{ currentPost.participants ? currentPost.participants.length : 0 }}/{{ currentPost.max_people }}명</span
          >
        </div>

        <div class="mt-[30px]">
          <div>{{ currentPost.description }}</div>
          <!-- 멤버 소개 -->
          <MemberInfo
            v-if="userData"
            :participants="currentPost.participants || []"
            :userData="userData"
            :pageType="'club'"
          />
          <!-- 안내사항 -->
          <div class="mt-5">
            <p class="text-[#1C8A6A]">안내사항</p>
            <p>자세한 정보를 알려드릴게요</p>
            <div class="mt-2">
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/members.svg" alt="members" />
                <p>
                  <!-- {{ currentPost.participants ? currentPost.participants.length : 1 }}/{{ currentPost.max_people }}명
                  선착순 -->
                  {{ currentPost.max_people }}명
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
                <img src="@/assets/images/location.svg" alt="location" />
                <span>{{ addressName }}</span>
                <span v-if="currentPost.place !== '온라인'"
                  >({{
                    JSON.parse(currentPost.place).road_address_name || JSON.parse(currentPost.place).address_name
                  }})</span
                >
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/category.svg" alt="category" />

                <router-link to="#" class="underline">{{ currentPost.subject }}</router-link>
                <span v-if="currentPost.subject"> > </span>
                <router-link to="#" class="underline">{{ currentPost.category }}</router-link>
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
            :comments="currentPost.comments || []"
            :postId="currentPost.id"
            :pageType="'club'"
            :currentPost="currentPost"
            :userId="userId"
            :isLiked="isLiked"
            @updateLike="updateLikeStatus"
          />
        </div>
      </div>
    </div>

    <!-- 신청하기 -->
    <Register
      :title="currentPost.title"
      :currentPost="currentPost"
      :pageType="'club'"
      :userId="userId"
      :action="joinClub"
      :isLiked="isLiked"
      @updateParticipants="handleUpdateParticipants"
      @updateLike="updateLikeStatus"
    />
  </div>
</template>
<style scoped></style>
