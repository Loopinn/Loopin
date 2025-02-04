<script setup>
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const userClubPosts = ref(null);

const postStore = usePostStore();
const { loadClubPosts } = postStore;
const { clubPosts } = storeToRefs(postStore);

onBeforeMount(async () => {
  const { data: getUserId, error: getUserIdError } = await supabase
    .from("userinfo")
    .select("id")
    .eq("nickname", route.params.id)
    .single();

  if (getUserIdError) {
    console.error(getUserIdError);
  }

  await loadClubPosts();
  if (clubPosts.value) {
    userClubPosts.value = clubPosts.value.filter((post) => post.creator === getUserId.id);
  }
});
</script>
<template>
  <div class="bg-[#f4f4f4] h-screen p-4">
    <h2 class="text-center text-[22px] mb-3">{{ route.params.id }}님의 클럽</h2>
    <RouterLink v-for="userClubPost in userClubPosts" :to="`/club/${userClubPost.id}`">
      <ChannelPostCard :post="userClubPost" channelName="클럽" />
    </RouterLink>
  </div>
</template>
<style scoped></style>
