<script setup>
import { onBeforeMount, ref } from "vue";
import ChannelPostCard from "../channel/ChannelPostCard.vue";
import NoPosts from "../common/NoPosts.vue";
import UserMeetingClub from "./UserMeetingClub.vue";
import MoreBtn from "../common/MoreBtn.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps(["meetingData", "isMyPage", "userNickName"]);
console.log("meetingData", props.meetingData);
console.log("userNickName", props.userNickName);

const clubPosts = ref(null);
const socialingPosts = ref(null);
const challengePosts = ref(null);

onBeforeMount(() => {
  // 클럽 게시글
  clubPosts.value = props.meetingData.filter((meetData) => meetData.type === "club_posts");

  // 소셜링 게시글
  socialingPosts.value = props.meetingData.filter((meetData) => meetData.type === "socialing_posts");

  // 챌린지 게시글
  challengePosts.value = props.meetingData.filter((meetData) => meetData.type === "challenge_posts");
});
</script>
<template>
  <div class="flex flex-col gap-[50px]">
    <div>
      <div class="mb-5 flex items-center justify-between">
        <p class="text-[18px] font-medium">내 클럽</p>
        <p
          class="text-[14px] cursor-pointer hover:underline hover:underline-offset-4 text-gray-500"
          @click="router.push(`${isMyPage ? '/profile/posts/club' : `/user/${props.userNickName}/posts/club`}`)"
        >
          더보기
        </p>
      </div>
      <div :class="`flex gap-3 flex-wrap items-start ${!clubPosts.length && 'justify-center'}`">
        <UserMeetingClub v-if="clubPosts.length" v-for="{ data, type } in clubPosts" :key="data.id" :postData="data" />
        <NoPosts v-else text="참여중인 클럽이 없어요!" />
      </div>
    </div>
    <div>
      <p class="text-[18px] font-medium mb-5">진행한 소셜링</p>
      <div :class="`flex flex-col justify-center ${!socialingPosts.length && 'items-center'}`">
        <RouterLink
          v-if="socialingPosts.length"
          v-for="{ data, type } in socialingPosts.slice(-3)"
          :to="{ path: `/socialing/${data.id}` }"
          :key="data.id"
        >
          <ChannelPostCard :post="data" channelName="소셜링" />
        </RouterLink>
        <NoPosts v-else text="진행한 소셜링이 없어요" css="h-[50px] flex items-center justify-center" />
        <MoreBtn
          v-if="socialingPosts.length > 3"
          :link="`${isMyPage ? '/profile/posts/socialing' : `/user/${userNickName}/posts/socialing`}`"
        />
      </div>
    </div>
    <div class="">
      <p class="text-[18px] font-medium mb-5">진행한 챌린지</p>
      <div :class="`flex flex-col justify-center ${!socialingPosts.length && 'items-center'}`">
        <RouterLink
          v-if="challengePosts.length"
          v-for="{ data, type } in challengePosts.slice(-3)"
          :to="{ path: `/challenge/${data.id}` }"
          :key="data.id"
        >
          <ChannelPostCard :post="data" channelName="챌린지" />
        </RouterLink>
        <NoPosts v-else text="진행한 챌린지가 없어요" css="h-[50px] flex items-center justify-center" />
        <MoreBtn
          v-if="challengePosts.length > 3"
          :link="`${isMyPage ? '/profile/posts/challenge' : `/user/${userNickName}/posts/challenge`}`"
        />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
