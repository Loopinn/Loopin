<script setup>
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const userSocialingPosts = ref(null);

const postStore = usePostStore();
const { loadSocialPosts } = postStore;
const { socialingPosts } = storeToRefs(postStore);

onBeforeMount(async () => {
  console.log(route.params.id);
  const { data: getUserId, error: getUserIdError } = await supabase
    .from("userinfo")
    .select("id")
    .eq("nickname", route.params.id)
    .single();
  console.log(getUserId);

  if (getUserIdError) {
    console.error(getUserIdError);
  }

  await loadSocialPosts();
  if (socialingPosts.value) {
    userSocialingPosts.value = socialingPosts.value.filter((post) => post.creator === getUserId.id);
  }
  console.log("userSocialingPosts", userSocialingPosts.value);
});
</script>
<template>
  <div class="bg-[#f4f4f4] h-screen p-4">
    <h2 class="text-center text-[22px] mb-3">{{ route.params.id }}님의 소셜링</h2>
    <RouterLink v-for="userSocialingPost in userSocialingPosts" :to="`/socialing/${userSocialingPost.id}`">
      <ChannelPostCard :post="userSocialingPost" channelName="소셜링" />
    </RouterLink>
  </div>
</template>
<style scoped></style>
