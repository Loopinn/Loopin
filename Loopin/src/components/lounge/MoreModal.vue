<script setup>
import supabase from "@/config/supabase";
import { defineProps, onMounted, watch, ref, onBeforeMount } from "vue";
import ChoiceModal from "@/components/modal/ChoiceModal.vue";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "@/stores/postStore";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const postStore = usePostStore();
const authStore = useAuthStore();
const { loginUser, deleteUser } = authStore;
const { loadLoungePosts, deleteLoungePost, deleteClubPost, deleteSocialPost, deleteChallengePost } = postStore;

const router = useRouter();
const route = useRoute();
const isChoiceModalOpen = ref(false);
const props = defineProps({
  isModalOpen: {
    type: Boolean,
  },
  postId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "confirm"]);

function closeModal() {
  emit("close");
}

function openChoiceModal() {
  isChoiceModalOpen.value = true;
}
function closeChoiceModal() {
  isChoiceModalOpen.value = true;
}

const toggleModal = () => {
  isChoiceModalOpen.value = false;
};

const handleAction = (action) => {
  const routesMap = {
    "/club": `/write/club/${props.postId}`,
    "/socialing": `/write/socialing/${props.postId}`,
    "/challenge": `/write/challenge/${props.postId}`,
  };
  const matchedRoute = Object.keys(routesMap).find((key) => route.fullPath.includes(key));
  if (action === "삭제") {
    openChoiceModal();
    closeModal();
  } else if (matchedRoute) {
    router.push(routesMap[matchedRoute]);
  } else router.push(`/lounge/write/${props.postId}`);
};

const handleLoungeDelete = async () => {
  const parsedPosts = loginUser.posts.map((post) => JSON.parse(post)).filter((item) => item.id !== props.postId);
  const { data, error } = await supabase
    .from("userinfo")
    .update({ posts: parsedPosts })
    .eq("id", loginUser.id)
    .select()
    .single();
  if (error) {
    console.error("오류", error.message);
    return;
  }

  deleteUser(data);
  deleteLoungePost(props.postId);
  router.push("/lounge").then(() => {
    loadLoungePosts();
  });
};

const handleDelete = () => {
  const routesMap = {
    club: {
      route: "/club",
      deleteFunc: deleteClubPost,
    },
    socialing: {
      route: "/socialing",
      deleteFunc: deleteSocialPost,
    },
    challenge: {
      route: "/challenge",
      deleteFunc: deleteChallengePost,
    },
  };
  const currentRoute = Object.keys(routesMap).find((key) => route.fullPath.includes(key));
  if (currentRoute) {
    const { route: redirectRoute, deleteFunc } = routesMap[currentRoute];
    deleteFunc(props.postId, loginUser.id);
    router.push(redirectRoute);
  } else {
    console.error("Invalid route or route not handled.");
  }
};

const modalMessage = () => {
  const routesMap = {
    lounge: {
      route: "/lounge",
      type: "피드를",
    },
    club: {
      route: "/club",
      type: "클럽을",
    },
    socialing: {
      route: "/socialing",
      type: "소셜링을",
    },
    challenge: {
      route: "/challenge",
      type: "챌린지를",
    },
  };
  const currentRoute = Object.keys(routesMap).find((key) => route.fullPath.includes(key));
  if (currentRoute) {
    const { type } = routesMap[currentRoute];
    return type;
  }
  return null;
};
</script>

<template>
  <div>
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <div class="flex flex-col gap-1 px-2 pb-2 w-[600px] font-bold">
        <div class="bg-white rounded-xl mb-2 text-center">
          <button @click="handleAction('수정')" class="w-full text-black py-4 border-b">수정하기</button>
          <button @click="handleAction('삭제')" class="w-full text-red-500 py-4">삭제하기</button>
        </div>
        <button @click="closeModal" class="w-full text-center text-black py-4 bg-white rounded-lg">취소</button>
      </div>
    </div>
  </div>
  <ChoiceModal
    :isOpen="isChoiceModalOpen"
    :message="`${modalMessage()} 삭제하시겠습니까?`"
    :buttonMessage="'확인'"
    @close="toggleModal"
    @confirm="route.fullPath.includes('lounge') ? handleLoungeDelete() : handleDelete()"
  >
  </ChoiceModal>
</template>
