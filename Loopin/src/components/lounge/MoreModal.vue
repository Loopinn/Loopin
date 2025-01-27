<script setup>
import supabase from "@/config/supabase";
import { defineProps, ref } from "vue";
import ChoiceModal from "@/components/modal/ChoiceModal.vue";
import { useRouter } from "vue-router";
import { usePostStore } from "@/stores/postStore";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const postStore = usePostStore();
const authStore = useAuthStore();
const { loginUser, deleteUser } = authStore;
const { deleteLoungePost, loadLoungePosts } = postStore;

const router = useRouter();
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

function handleAction(action) {
  if (action === "수정") {
    router.push(`/lounge/write/${props.postId}`);
  } else {
    openChoiceModal();
    closeModal();
  }
}

const handleDelete = async () => {

  const parsedPosts = loginUser.posts.map(post => JSON.parse(post)).filter((item) => item.id !== props.postId);
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
  
  deleteUser(data) 
  deleteLoungePost(props.postId);
  router.push("/lounge").then(() => {
    loadLoungePosts();
  });
}
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
    :message="'피드를 삭제하시겠어요?'"
    :buttonMessage="'확인'"
    @close="toggleModal"
    @confirm="handleDelete"
  >
  </ChoiceModal>
</template>
