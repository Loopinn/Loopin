<script setup>
import { ref, defineProps, onMounted, computed, watch } from "vue";
import supabase from "@/config/supabase";
import { useRouter } from "vue-router";

import MemberInfoList from "./MemberInfoList.vue";
import { resizeImage } from "@/utils/resizeImage";

const props = defineProps({
  participants: {
    type: Array,
    required: true,
  },
  userData: {
    type: Object,
  },
  pageType: {
    type: String,
  },
});

const router = useRouter();

const memberInfoModal = ref(false);
const participantsInfo = ref([]);
const userData = ref(props.userData || {});

const memberInfoModalOpen = () => {
  memberInfoModal.value = !memberInfoModal.value;
};

const memberInfoModalClose = () => {
  memberInfoModal.value = false;
};

const textColor = computed(() => {
  switch (props.pageType) {
    case "socialing":
      return "text-[#FF0000]";
    case "challenge":
      return "text-[#46A7CD]";
    case "club":
    default:
      return "text-[#1C8A6A]";
  }
});

const fetchParticipantsInfo = async () => {
  try {
    // participantsInfo 배열을 미리 초기화
    participantsInfo.value = new Array(props.participants.length).fill(null);

    await Promise.all(
      props.participants.map(async (id, index) => {
        const { data: userData, error: userError } = await supabase
          .from("userinfo")
          .select("id, nickname, profile_img, description")
          .eq("id", id)
          .single();

        participantsInfo.value[index] = userData;
        resizeProfile(participantsInfo.value[index].profile_img, index);
      }),
    );
  } catch (error) {
    console.log("참여자 정보를 가져오는 중 알 수 없는 오류:", error);
  }
};

onMounted(() => {
  fetchParticipantsInfo();
});

watch(
  () => props.participants,
  (newParticipants) => {
    if (newParticipants.length > 0) {
      fetchParticipantsInfo();
    } else {
      participantsInfo.value = [];
    }
  },
  { immediate: true },
);

// 이미지를 순서대로 저장
const resizeProfile = (imgUrl, index) => {
  if (!imgUrl) {
    participantsInfo.value[index].profile_img = null;
    return;
  }

  if (imgUrl && imgUrl.includes("k.kakaocdn.net")) {
    participantsInfo.value[index].profile_img = imgUrl;
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    participantsInfo.value[index].profile_img = resizeImage(img, 100, 100);
  };
  img.src = imgUrl;
};
</script>
<template>
  <div class="mt-5">
    <p v-if="props.pageType === 'club'" :class="textColor">가입 멤버</p>
    <p v-else :class="textColor">멤버 소개</p>
    <p v-if="props.pageType === 'club'">함께 소통하며 활동하고 있어요</p>
    <p v-else>우리 반갑게 만나요</p>

    <!-- 작성자 정보 -->
    <div v-if="props.pageType === 'club'" class="flex gap-1 mt-2 items-center">
      <img
        v-if="userData?.profile_img"
        :src="userData.profile_img"
        alt="hostprofile"
        class="rounded-full w-9 h-9 object-cover mr-1.5 cursor-pointer"
        @click="router.push(`/user/${userData?.nickname}`)"
      />
      <img
        v-else
        src="@/assets/images/no-profile.svg"
        alt="hostprofile"
        class="rounded-full w-9 h-9 cursor-pointer"
        @click="router.push(`/user/${userData?.nickname}`)"
      />
      <div v-if="props.pageType === 'club'" class="flex flex-col">
        <span class="text-[15px]">{{ userData?.nickname }}</span>
        <span class="text-[13px] text-[#B1B1B1] line-clamp-1">{{ userData?.description || "자기소개가 없습니다." }}</span>
      </div>
      <div v-else class="flex flex-col">
        <span class="text-[15px]">{{ participants?.nickname }}</span>
        <span class="text-[13px] text-[#B1B1B1] line-clamp-1">{{ participants?.description || "자기소개가 없습니다." }}</span>
      </div>
    </div>

    <!-- 참여자가 없는 경우 -->
    <div v-if="!participantsInfo || participantsInfo.length === 0" class="mt-5 text-blue-500 font-bold">
      첫 참여자가 되어보세요!
    </div>
    <!-- 참여자가 있는 경우 (클럽) -->
    <div v-if="props.pageType === 'club'" class="flex gap-4 mt-2">
      <div v-for="participant in participantsInfo" class="gap-1 mt-2">
        <img
          v-if="participant?.profile_img"
          :src="participant?.profile_img"
          alt="profile"
          class="rounded-full w-9 h-9 object-cover cursor-pointer"
          @click="router.push(`/user/${participant?.nickname}`)"
        />
        <img
          v-else
          src="@/assets/images/no-profile.svg"
          alt="profile"
          class="rounded-full w-9 h-9 mr-1.5 cursor-pointer"
          @click="router.push(`/user/${userData?.nickname}`)"
        />
        <div class="flex flex-col">
          <span class="text-[15px]">{{ participant?.nickname }}</span>
        </div>
      </div>
    </div>
    <!-- 참여자가 있는 경우 (소셜링, 챌린지) -->
    <div v-else v-for="participant in participantsInfo" class="flex gap-1 mt-2">
      <img
        v-if="participant?.profile_img"
        :src="participant?.profile_img"
        alt="hostprofile"
        class="rounded-full w-9 h-9 object-cover mr-1.5 cursor-pointer"
        @click="router.push(`/user/${participant?.nickname}`)"
      />
      <img
        v-else
        src="@/assets/images/no-profile.svg"
        alt="hostprofile"
        class="rounded-full w-9 h-9 mr-1.5 cursor-pointer"
        @click="router.push(`/user/${participant?.nickname}`)"
      />
      <div class="flex flex-col">
        <span class="text-[15px]">{{ participant?.nickname }}</span>
        <span class="text-[13px] text-[#B1B1B1] line-clamp-1">{{ participant?.description || "자기소개가 없습니다." }}</span>
      </div>
    </div>

    <button
      v-if="participants?.length > 5"
      class="flex items-center justify-center mt-2 w-full h-[40px] rounded-[5px] bg-white font-semibold"
      @click="memberInfoModalOpen"
    >
      더보기 >
    </button>
    <!-- 멤버 리스트 모달 -->
    <MemberInfoList :isOpen="memberInfoModal" :participants="participantsInfo" @close="memberInfoModalClose" />
  </div>
</template>
<style scoped></style>
