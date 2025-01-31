<script setup>
import supabase from "@/config/supabase";
import { twMerge } from "tailwind-merge";
import { onBeforeMount, ref } from "vue";
import ChannelPostCard from "../channel/ChannelPostCard.vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const props = defineProps(["isMyPage", "userNickName", "userJoinPosts"]);

const categoryName = ref("클럽");

const authStore = useAuthStore();
const { loginUser } = authStore;

const joiningClub = ref([]);
const joiningSocialing = ref([]);
const joiningChallenge = ref([]);

const getJoinPost = async (postId, type) => {
  const { data, error } = await supabase.from(type).select().eq("id", postId).single();
  if (error) throw new Error("게시글 불러오기 실패" + error);
  console.log("joinPostData", data, type);
  return data;
};

onBeforeMount(async () => {
  console.log("props.userJoinPosts", props.userJoinPosts);
  console.log("loginUser", loginUser);

  if (props.isMyPage) {
    await Promise.all(
      loginUser.joinPosts.map(async (joinPost) => {
        const post = JSON.parse(joinPost);

        if (post.type === "club_posts") {
          const response = await getJoinPost(post.id, post.type);
          joiningClub.value = [...joiningClub.value, response];
        } else if (post.type === "socialing_posts") {
          const response = await getJoinPost(post.id, post.type);
          joiningSocialing.value = [...joiningSocialing.value, response];
        } else {
          const response = await getJoinPost(post.id, post.type);
          joiningChallenge.value = [...joiningChallenge.value, response];
        }
      }),
    );
  } else {
    await Promise.all(
      props.userJoinPosts.map(async (joinPost) => {
        const post = JSON.parse(joinPost);

        if (post.type === "club_posts") {
          const response = await getJoinPost(post.id, post.type);
          joiningClub.value = [...joiningClub.value, response];
        } else if (post.type === "socialing_posts") {
          const response = await getJoinPost(post.id, post.type);
          joiningSocialing.value = [...joiningSocialing.value, response];
        } else {
          const response = await getJoinPost(post.id, post.type);
          joiningChallenge.value = [...joiningChallenge.value, response];
        }
      }),
    );
  }

  console.log(joiningClub.value);
  console.log(joiningSocialing.value);
  console.log(joiningChallenge.value);
});
</script>
<template>
  <div>
    <ul class="flex gap-2">
      <li
        :class="
          twMerge(`w-[70px] h-[30px] text-[15px] bg-white flex items-center justify-center 
        border-2  rounded-[20px] cursor-pointer ${categoryName === '클럽' && 'border-black'}`)
        "
        @click="categoryName = '클럽'"
      >
        클럽
      </li>
      <li
        :class="
          twMerge(`w-[70px] h-[30px] text-[15px] bg-white flex items-center justify-center 
        border-2  rounded-[20px] cursor-pointer ${categoryName === '소셜링' && 'border-black'}`)
        "
        @click="categoryName = '소셜링'"
      >
        소셜링
      </li>
      <li
        :class="
          twMerge(`w-[70px] h-[30px] text-[15px] bg-white flex items-center justify-center 
        border-2 rounded-[20px] cursor-pointer ${categoryName === '챌린지' && 'border-black'}`)
        "
        @click="categoryName = '챌린지'"
      >
        챌린지
      </li>
    </ul>
    <div v-if="categoryName === '클럽'" class="mt-4">
      <RouterLink v-for="clubpost in joiningClub" :key="clubpost.id" :to="`/club/${clubpost.id}`">
        <ChannelPostCard :post="clubpost" channelName="클럽" />
      </RouterLink>
    </div>
    <div v-else-if="categoryName === '소셜링'" class="mt-4">
      <RouterLink
        v-for="socialingPost in joiningSocialing"
        :key="socialingPost.id"
        :to="`/socialing/${socialingPost.id}`"
      >
        <ChannelPostCard :post="socialingPost" channelName="소셜링" />
      </RouterLink>
    </div>
    <div v-else class="mt-4">
      <RouterLink
        v-for="challengePost in joiningChallenge"
        :key="challengePost.id"
        :to="`/challenge/${challengePost.id}`"
      >
        <ChannelPostCard :post="challengePost" channelName="챌린지" />
      </RouterLink>
    </div>
  </div>
</template>
<style scoped></style>
