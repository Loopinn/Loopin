<script setup>
import { onBeforeMount, ref } from "vue";
import ChannelPostCard from "../channel/ChannelPostCard.vue";
import NoPosts from "../common/NoPosts.vue";
import UserMeetingClub from "./UserMeetingClub.vue";

const props = defineProps(["meetingData"]);
console.log("meetingData", props.meetingData);

const clubPosts = ref(null);

onBeforeMount(() => {
  clubPosts.value = props.meetingData.filter((meetData) => meetData.type === "club_posts");
  console.log(clubPosts.value);
});
</script>
<template>
  <div class="flex flex-col gap-[50px]">
    <div>
      <p class="text-[18px] font-semibold mb-5">참여 중인 클럽</p>
      <div :class="`flex gap-3 flex-wrap items-center ${!clubPosts.length && 'justify-center'}`">
        <UserMeetingClub v-if="clubPosts.length" v-for="{ data, type } in clubPosts" :key="data.id" :postData="data" />
        <NoPosts v-else text="참여중인 클럽이 없어요!" />
      </div>
    </div>
    <div>
      <p class="text-[18px] font-semibold mb-5">진행한 소셜링</p>
      <div class="flex justify-center">
        <!-- <ChannelPostCard /> -->
        <NoPosts text="진행한 소셜링이 없어요" css="h-[50px]" />

        <!-- <p class="text-[#898989]">진행한 소셜링이 없어요</p> -->
      </div>
    </div>
    <div class="">
      <p class="text-[18px] font-semibold mb-5">진행한 챌린지</p>
      <div class="flex justify-center">
        <NoPosts text="진행한 챌린지가 없어요" css="h-[50px]" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
