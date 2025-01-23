<script setup>
import ChannelPostCard from "../channel/ChannelPostCard.vue";
import NoPosts from "../common/NoPosts.vue";
import UserMeetingClub from "./UserMeetingClub.vue";

const props = defineProps(["meetingData"]);
console.log(props.meetingData);
</script>
<template>
  <div class="flex flex-col gap-[50px]">
    <div>
      <p class="text-[18px] font-semibold mb-5">참여 중인 클럽</p>
      <div class="flex gap-2 flex-wrap items-center">
        <UserMeetingClub />
        <UserMeetingClub />
        <UserMeetingClub />
        <UserMeetingClub />
        <UserMeetingClub />
        <UserMeetingClub />
        <UserMeetingClub />
        <UserMeetingClub />
        <UserMeetingClub />
      </div>
    </div>
    <div>
      <p class="text-[18px] font-semibold mb-5">진행한 소셜링</p>
      <div class="flex justify-center">
        <ChannelPostCard />
        <!-- <p class="text-[#898989]">진행한 소셜링이 없어요</p> -->
      </div>
    </div>
    <div class="">
      <p class="text-[18px] font-semibold mb-5">진행한 챌린지</p>
      <div class="flex justify-center">
        <NoPosts text="진행한 챌린지가 없어요" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
