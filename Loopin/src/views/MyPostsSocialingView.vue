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
const { loadSocialPosts } = postStore;
const { socialingPosts } = storeToRefs(postStore);

const mySocialingPosts = ref(null);

onBeforeMount(async () => {
  await loadSocialPosts();
  console.log(socialingPosts.value);
  if (socialingPosts.value) {
    mySocialingPosts.value = socialingPosts.value.filter((post) => post.creator === loginUser.id);
  }
  console.log("mySocialingPosts", mySocialingPosts.value);
});
</script>
<template>
  <div class="bg-[#f4f4f4] h-screen p-4">
    <h2 class="text-center text-[22px] mb-3">내 챌린지</h2>
    <RouterLink v-for="mySocialingPost in mySocialingPosts" :to="`/socialing/${mySocialingPost.id}`">
      <ChannelPostCard :post="mySocialingPost" channelName="소셜링" />
    </RouterLink>
  </div>
</template>
<style scoped></style>
