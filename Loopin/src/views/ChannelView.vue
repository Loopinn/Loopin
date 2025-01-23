<script setup>
import ChannelCategory from "@/components/channel/ChannelCategory.vue";
import ChannelEmpty from "@/components/channel/ChannelEmpty.vue";
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const postStore = usePostStore();
const { socialingPosts, clubPosts, challengePosts } = storeToRefs(postStore);
const { loadSocialPosts, loadClubPosts, loadChallengePosts } = postStore;

const channels = [
  { name: "socialing", posts: socialingPosts, load: loadSocialPosts },
  { name: "club", posts: clubPosts, load: loadClubPosts },
  { name: "challenge", posts: challengePosts, load: loadChallengePosts },
];

const currentChannel = ref(null);
const route = useRoute();

onMounted(() => {
  currentChannel.value = channels.find((channel) => channel.name === route.path.slice(1));
  console.log(currentChannel.value);
  console.log(route.path);

  if (currentChannel.value) {
    currentChannel.value.load();
  } else {
    console.log("채널을 찾을 수 없습니다.");
  }
});

watch(
  () => route.path,
  (newPath) => {
    const newChannel = channels.find((channel) => channel.name === newPath.slice(1));
    if (newChannel) {
      currentChannel.value = newChannel;
      currentChannel.value.load(); // 새로운 채널 데이터 로드
    } else {
      console.log("채널을 찾을 수 없습니다.");
    }
  },
);
</script>
<template>
  <div class="mx-auto py-3 min-h-screen w-[600px] bg-[#F4F4F4]">
    <div class="mx-[15px]">
      <!-- categories -->
      <ChannelCategory />
      <div>
        <!-- channelpostcard -->
        <template v-if="currentChannel?.posts.length">
          <div v-for="post in currentChannel.posts" :key="post.id">
            <RouterLink :to="{ path: `/${currentChannel.name}/${post.id}` }">
              <ChannelPostCard :post="post" />
            </RouterLink>
          </div>
        </template>
        <!-- 게시물이 없을 경우 -->
        <ChannelEmpty v-else />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
