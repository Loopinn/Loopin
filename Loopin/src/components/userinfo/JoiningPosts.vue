<script setup>
import supabase from "@/config/supabase";
import { twMerge } from "tailwind-merge";
import { onBeforeMount, ref } from "vue";
import ChannelPostCard from "../channel/ChannelPostCard.vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import NoPosts from "../common/NoPosts.vue";
import clubIcon from "@/assets/images/club-active.svg";
import socialingIcon from "@/assets/images/socialing-active.svg";
import challengeIcon from "@/assets/images/challenge-active.svg";

const props = defineProps(["isMyPage", "userNickName", "userJoinPosts"]);

const router = useRouter();

const categoryName = ref("클럽");

const authStore = useAuthStore();
const { loginUser } = authStore;

const joiningClub = ref([]);
const joiningSocialing = ref([]);
const joiningChallenge = ref([]);

const isLoading = ref(true);

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
        border  rounded-[20px] cursor-pointer ${categoryName === '클럽' && 'bg-[#1c8a6a] text-white'}`)
        "
        @click="categoryName = '클럽'"
      >
        클럽
      </li>
      <li
        :class="
          twMerge(`w-[70px] h-[30px] text-[15px] bg-white flex items-center justify-center 
        border rounded-[20px] cursor-pointer ${categoryName === '소셜링' && 'bg-[#f43630] text-white'}`)
        "
        @click="categoryName = '소셜링'"
      >
        소셜링
      </li>
      <li
        :class="
          twMerge(`w-[70px] h-[30px] text-[15px] bg-white flex items-center justify-center 
        border rounded-[20px] cursor-pointer ${categoryName === '챌린지' && 'bg-[#3498D0] text-white'}`)
        "
        @click="categoryName = '챌린지'"
      >
        챌린지
      </li>
    </ul>
    <div v-if="categoryName === '클럽'" class="mt-4">
      <RouterLink
        v-if="joiningClub.length > 0"
        v-for="clubpost in joiningClub"
        :key="clubpost.id"
        :to="`/club/${clubpost.id}`"
      >
        <ChannelPostCard :post="clubpost" channelName="클럽" />
      </RouterLink>
      <div v-else class="flex flex-col items-center justify-center gap-2 mt-[200px]">
        <NoPosts text="참가한 클럽이 없습니다." css="text-[20px]" />
        <div
          class="flex items-center justify-center gap-2 bg-[#1c8a6a] text-white w-[150px] h-[50px] rounded-[15px] hover:bg-[#1c8a6be7] cursor-pointer"
          @click="router.push('/club')"
        >
          <img :src="clubIcon" alt="클럽 아이콘" class="w-5 h-5" />
          클럽 보러가기
        </div>
      </div>
    </div>
    <div v-else-if="categoryName === '소셜링'" class="mt-4">
      <RouterLink
        v-if="joiningSocialing.length > 0"
        v-for="socialingPost in joiningSocialing"
        :key="socialingPost.id"
        :to="`/socialing/${socialingPost.id}`"
      >
        <ChannelPostCard :post="socialingPost" channelName="소셜링" />
      </RouterLink>
      <div v-else class="flex flex-col items-center justify-center gap-2 mt-[200px]">
        <NoPosts text="참가한 소셜링이 없습니다." css="text-[20px]" />
        <div
          class="flex items-center justify-center gap-2 bg-[#f43630] text-white w-[160px] h-[50px] rounded-[15px] hover:bg-[#f43630e7] cursor-pointer"
          @click="router.push('/socialing')"
        >
          <img :src="socialingIcon" alt="소셜링 아이콘" class="w-5 h-5" />
          소셜링 보러가기
        </div>
      </div>
    </div>
    <div v-else class="mt-4">
      <RouterLink
        v-if="joiningChallenge.length > 0"
        v-for="challengePost in joiningChallenge"
        :key="challengePost.id"
        :to="`/challenge/${challengePost.id}`"
      >
        <ChannelPostCard :post="challengePost" channelName="챌린지" />
      </RouterLink>
      <div v-else class="flex flex-col items-center justify-center gap-2 mt-[200px]">
        <NoPosts text="참가한 챌린지가 없습니다." css="text-[20px]" />
        <div
          class="flex items-center justify-center gap-2 bg-[#3498D0] text-white w-[160px] h-[50px] rounded-[15px] hover:bg-[#3498D0e7] cursor-pointer"
          @click="router.push('/challenge')"
        >
          <img :src="challengeIcon" alt="챌린지 아이콘" class="w-5 h-5" />
          챌린지 보러가기
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
