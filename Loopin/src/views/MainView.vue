<script setup>
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import { ref } from "vue";

// 임시(posts 추가 필요)
const channelviews = ref([
  {
    name: "소셜링",
    icon: "./src/assets/images/socialing.svg",
    description: { line1: "똑같은 일상을 다채롭게 만들어 줄", line2: "원데이 취향 모임으로 만나요" },
    route: "/socialing",
  },
  {
    name: "클럽",
    icon: "./src/assets/images/club.svg",
    description: { line1: "지속형 모임으로", line2: "계속해서 친하게 지내요" },
    route: "/club",
  },
  {
    name: "챌린지",
    icon: "./src/assets/images/challenge.svg",
    description: { line1: "같은 목표를 가진", line2: "멤버들과 함께 도전해요" },
    route: "/challenge",
  },
]);
</script>
<template>
  <div class="w-[600px] mx-auto">
    <div class="h-[290px] pl-[15px] bg-[#d9d9d9]">
      <p class="text-[30px] pt-[53px] mb-[6px]">취향과 관심이<br />만나는 커뮤니티</p>
      <p class="text-[20px]">우리의 이야기가 시작되는 곳, 루핀</p>
    </div>

    <div v-for="(channelview, index) in channelviews" :key="index" class="bg-[#F4F4F4] px-[15px] py-[72px]">
      <p class="flex justify-center">
        <img :src="channelview.icon" alt="channelicon" class="inline-block text-[20px] mr-3 mb-9" />{{
          channelview.name
        }}
      </p>
      <p class="text-[28px] mb-[25px] text-center">
        {{ channelview.description.line1 }}<br />{{ channelview.description.line2 }}
      </p>

      <ChannelPostCard />
      <ChannelPostCard />
      <ChannelPostCard />
      <RouterLink :to="channelview.route">
        <button class="w-[570px] h-[66px] rounded-2xl text-center text-[20px] bg-white">더보기</button>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped></style>
