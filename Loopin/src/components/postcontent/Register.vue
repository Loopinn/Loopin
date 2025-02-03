<script setup>
import { defineProps, ref, computed, defineEmits, onBeforeMount } from "vue";
import ChoiceModal from "../modal/ChoiceModal.vue";
import ConfirmModal from "../modal/ConfirmModal.vue";
import like from "@/assets/images/likered_full.svg";
import unlike from "@/assets/images/likered.svg";
import supabase from "@/config/supabase";
import { debounce } from "lodash";
import { channelLike } from "@/utils/channelLike";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import MoreModal from "../lounge/MoreModal.vue";

const authStore = useAuthStore();

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
  isUserInClub: {
    type: Boolean,
  },
  clubId: {
    type: String,
  },
  isLiked: {
    type: Boolean,
  },
  creator: {
    type: String,
  },
});

const router = useRouter();
const route = useRoute();

const emit = defineEmits(["updateParticipants", "updateLike"]);

const postId = route.params.id;
const isModalOpen = ref(false);
const isMoreModalOpen = ref(false);
const participants = ref(props.currentPost?.participants || []);
const isJoined = computed(() => participants.value.includes(props.userId));
const isFull = computed(() => {
  return props.currentPost?.max_people <= participants.value.length && !isJoined.value;
});
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
  return isJoined.value ? "확인" : activityType;
});
const buttonText = computed(() => {
  console.log(props.creator)
  console.log(props.userId)
  if (!authStore.loginUser) return "로그인 후 이용가능합니다";
  if (props.creator === props.userId) return "게시글 관리하기";
  if (!props.isUserInClub && props.clubId) return "클럽 참여하러 가기";
  if (isFull.value) return "참여 인원 마감";
  const activityType = props.pageType === "socialing" || props.pageType === "challenge" ? "참여" : "신청";
  return isJoined.value ? `${activityType} 취소` : `${activityType}하기`;
});
const buttonStyle = computed(() => {
  if (!authStore.loginUser) {
    return "bg-gray-400 text-white";
  }
  if (isFull.value) {
    return "bg-gray-400 text-white";
  }
  // 작성자인 경우 색상 설정
  if (props.creator === props.userId) {
    return props.pageType === "socialing"
      ? "bg-[#FF0000] text-white"
      : props.pageType === "challenge"
        ? "bg-[#46A7CD] text-white"
        : "bg-[#1C8A6A] text-white";
  }
  return isJoined.value
    ? "bg-gray-400 text-white"
    : props.pageType === "socialing"
      ? "bg-[#FF0000] text-white "
      : props.pageType === "challenge"
        ? "bg-[#46A7CD] text-white"
        : "bg-[#1C8A6A] text-white";
});
const managePost = () => {
  console.log("hi");
  isMoreModalOpen.value = true;
};
const moveToClub = () => {
  if (!props.clubId) {
    console.error("clubId가 없습니다!");
    return;
  }

  router.push(`/club/${props.clubId}`);
};

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const handleConfirm = async () => {
  try {
    if (!props.userId) {
      return;
    }
    const response = await props.action(props.currentPost, props.userId);

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
// 좋아요
const likeLogin = ref(false);
const toggleLikeLogin = () => {
  likeLogin.value = !likeLogin.value;
};
const tables = {
  socialing: "socialing_posts",
  club: "club_posts",
  challenge: "challenge_posts",
};

const table = (channel) => tables[channel] || null;

const likeCheck = async () => {
  if (!authStore.loginUser) {
    return;
  }

  const { data: userData, error: userDataError } = await supabase
    .from("userinfo")
    .select("postLikes")
    .eq("id", authStore.loginUser.id)
    .single();

  if (userDataError) {
    console.error(userDataError);
    return;
  }

  const likedPosts = userData?.postLikes ? userData.postLikes.map((item) => JSON.parse(item)) : [];
  const isLikedNow = likedPosts.some((post) => post.id === props.currentPost.id);
  emit("updateLike", isLikedNow);
};

const handleLike = debounce(async () => {
  if (!authStore.loginUser) {
    toggleLikeLogin();
    return;
  }
  const tableName = table(props.pageType);
  if (props.userId) {
    await channelLike(props.currentPost, props.userId, tableName);
    emit("updateLike", !props.isLiked);
  }
}, 300);

onBeforeMount(() => {
  likeCheck();
});
</script>
<template>
  <div class="bg-white fixed bottom-[60px] w-[600px] h-[80px] flex gap-[65px] items-center justify-center">
    <div class="flex flex-col">
      <button @click="handleLike">
        <img :src="props.isLiked ? like : unlike" alt="like" />
      </button>
      <span class="text-center text-[#FF0000]">{{ props.currentPost.likes }}</span>
    </div>

    <button
      class="w-[400px] h-[60px] rounded-[30px] text-[22px]"
      :class="buttonStyle"
      :disabled="!authStore.loginUser || isFull"
      @click="
        props.creator === props.userId
          ? managePost()
          : !props.isUserInClub && props.clubId
            ? moveToClub()
            : toggleModal()
      "
    >
      {{ buttonText }}
    </button>
  </div>
  <ChoiceModal
    :isOpen="isModalOpen"
    :message="modalMessage"
    :buttonMessage="getButtonMessage"
    :pageType="props.pageType"
    @confirm="handleConfirm"
    @close="toggleModal"
  />
  <ConfirmModal
    :isOpen="likeLogin"
    :message="'로그인이 필요합니다.'"
    :buttonMessage="'확인'"
    @close="toggleLikeLogin"
  />
  <MoreModal :isModalOpen="isMoreModalOpen" :postId="postId" @close="isMoreModalOpen = false" />
</template>
<style scoped></style>
