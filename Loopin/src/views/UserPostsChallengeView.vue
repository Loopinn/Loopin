<script setup>
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import { useAuthStore } from "@/stores/authStore";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const { loginUser } = authStore;

const postStore = usePostStore();
const { loadChallengePosts } = postStore;
const { challengePosts } = storeToRefs(postStore);

const myChallengePosts = ref(null);

onBeforeMount(async () => {
  await loadChallengePosts();
  console.log(challengePosts.value);
  if (challengePosts.value) {
    myChallengePosts.value = challengePosts.value.filter((post) => post.creator === loginUser.id);
  }
  console.log("MyChallengePosts", myChallengePosts.value);
});
</script>
<template>
  <div class="bg-[#f4f4f4] h-screen p-4">
    <h2 class="text-center text-[22px] mb-3">내 챌린지</h2>
    <RouterLink v-for="myChallengePost in myChallengePosts" :to="`/club/${myChallengePost.id}`">
      <ChannelPostCard :post="myChallengePost" channelName="챌린지" />
    </RouterLink>
  </div>
</template>
<style scoped></style>
