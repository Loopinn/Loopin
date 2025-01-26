<script setup>
import { defineProps, ref, computed, defineEmits } from "vue";

import ChoiceModal from "../modal/ChoiceModal.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  currentPost: {
    type: Object,
  },
  pageType: {
    type: String,
  },
  userId: {
    type: String,
  },
  action: {
    type: Function,
  },
});

const emit = defineEmits(["updateParticipants"]);

const isModalOpen = ref(false);
const participants = ref(props.currentPost?.participants || []);
const isJoined = computed(() => participants.value.includes(props.userId));
const modalMessage = computed(() => {
  const pageType = props.pageType;
  const activityType = pageType === "socialing" ? "소셜링" : pageType === "club" ? "클럽" : "챌린지";

  return isJoined.value
    ? `<b>${props.title}</b> ${activityType}에서 취소하시겠습니까?`
    : `<b>${props.title}</b> ${activityType}에 참여하시겠습니까?`;
});
const getButtonMessage = computed(() => {
  const activityType =
    props.pageType === (props.pageType === "socialing" || props.pageType === "challenge") ? "참여" : "신청";
  return isJoined.value ? "취소" : activityType;
});
const buttonText = computed(() => {
  const activityType = props.pageType === "socialing" || props.pageType === "challenge" ? "참여" : "신청";
  return isJoined.value ? `${activityType} 취소` : `${activityType}하기`;
});
const buttonStyle = computed(() => {
  return isJoined.value
    ? "bg-gray-400 text-white font-bold"
    : props.pageType === "socialing"
      ? "bg-[#FF0000] text-white font-bold"
      : props.pageType === "challenge"
        ? "bg-[#46A7CD] text-white font-bold"
        : "bg-[#1C8A6A] text-white font-bold";
});

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const handleConfirm = async () => {
  try {
    if (!props.userId) {
      console.log("userId가 없습니다.");
      return;
    }
    const response = await props.action(props.currentPost, props.userId);
    console.log("참여 결과:", response);

    if (isJoined.value) {
      const index = participants.value.indexOf(props.userId);
      if (index > -1) {
        participants.value.splice(index, 1);
      }
    } else {
      participants.value.push(props.userId);
    }
    emit("updateParticipants", [...participants.value]);
  } catch (error) {
    console.error("참여 처리 중 오류 발생:", error);
  } finally {
    toggleModal();
  }
};
</script>
<template>
  <div class="bg-white fixed bottom-[60px] w-[600px] h-[80px] flex gap-[65px] items-center justify-center">
    <div class="flex flex-col">
      <button>
        <img src="@/assets/images/likered.svg" alt="like" />
      </button>
      <span class="text-center text-[#FF0000]">00</span>
    </div>

    <button class="w-[400px] h-[60px] rounded-[30px] text-[25px]" :class="buttonStyle" @click="toggleModal">
      {{ buttonText }}
    </button>
  </div>
  <ChoiceModal
    :isOpen="isModalOpen"
    :message="modalMessage"
    :buttonMessage="getButtonMessage"
    @confirm="handleConfirm"
    @close="toggleModal"
  />
</template>
<style scoped></style>
