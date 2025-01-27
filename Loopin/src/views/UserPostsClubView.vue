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
const { loadClubPosts } = postStore;
const { clubPosts } = storeToRefs(postStore);

const myClubPosts = ref(null);

onBeforeMount(async () => {
  await loadClubPosts();
  console.log(clubPosts.value);
  if (clubPosts) {
    myClubPosts.value = clubPosts.value.filter((post) => post.creator === loginUser.id);
  }
  console.log("myClubPosts", myClubPosts.value);
});
</script>
<template>
  <div class="bg-[#f4f4f4] h-screen p-4">
    <h2 class="text-center text-[22px] mb-3">참여 중인 클럽</h2>
    <RouterLink v-for="myClubPost in myClubPosts" :to="`/club/${myClubPost.id}`">
      <ChannelPostCard :post="myClubPost" channelName="클럽" />
    </RouterLink>
  </div>
</template>
<style scoped></style>
