<script setup>
import { ref, defineProps, onMounted, watchEffect, watch } from "vue";
import supabase from "@/config/supabase";

import MemberInfoList from "./MemberInfoList.vue";
import { resizeImage } from "@/utils/resizeImage";

const props = defineProps({
  participants: {
    type: Array,
    required: true,
  },
});

const memberInfoModal = ref(false);
const participantsInfo = ref([]);

const memberInfoModalOpen = () => {
  memberInfoModal.value = !memberInfoModal.value;
};

const memberInfoModalClose = () => {
  memberInfoModal.value = false;
};

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
    <div class="text-[#FF0000]">멤버 소개</div>
    <div class="font-bold">자세한 정보를 알려드릴게요</div>

    <!-- 참여자가 없는 경우 -->
    <div v-if="!participantsInfo || participantsInfo.length === 0" class="mt-5 text-blue-500 font-bold">
      첫 참여자가 되어보세요!
    </div>
    <!-- 참여자가 있는 경우 -->
    <div v-for="participant in participantsInfo" class="flex gap-1 mt-2">
      <img
        v-if="participant?.profile_img"
        :src="participant?.profile_img"
        alt="hostprofile"
        class="rounded-full w-9 h-9 object-cover"
      />
      <img v-else src="@/assets/images/no-profile.svg" alt="hostprofile" class="rounded-full w-9 h-9" />
      <div class="flex flex-col">
        <span class="text-[15px]">{{ participant?.nickname }}</span>
        <span class="text-[13px] text-[#B1B1B1]">{{ participant?.description || "자기소개가 없습니다." }}</span>
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
