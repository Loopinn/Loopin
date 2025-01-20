<script setup>
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
</script>
<template>
  <div class="w-[600px] mx-auto">
    <div class="h-[290px] pl-[15px] bg-[#d9d9d9]">
      <p class="text-[30px] pt-[53px] mb-[6px]">취향과 관심이 <br />만나는 커뮤니티</p>
      <p class="text-[20px]">우리의 이야기가 시작되는 곳, 루핀</p>
    </div>
    <!-- 소셜링 -->
    <div class="bg-[#F4F4F4] px-[15px] py-[72px]">
      <div>
        <p class="flex justify-center">
          <img src="@/assets/images/socialing.svg" alt="channelicon" class="inline-block text-[20px] mr-3 mb-9" />소셜링
        </p>
        <p class="text-[28px] mb-[25px] text-center">
          똑같은 일상을 다채롭게 만들어 줄 <br />원데이 취향 모임으로 만나요
        </p>
      </div>

      <ChannelPostCard />
      <ChannelPostCard />
      <ChannelPostCard />

      <button class="w-[570px] h-[66px] rounded-2xl text-center text-[20px] bg-white">더보기</button>
    </div>
    <!-- 클럽 -->
    <div class="bg-[#F4F4F4] px-[15px] py-[72px]">
      <div>
        <p class="flex justify-center">
          <img src="@/assets/images/club.svg" alt="channelicon" class="inline-block text-[20px] mr-3 mb-9" />클럽
        </p>
        <p class="text-[28px] mb-[25px] text-center">지속형 모임으로<br />계속해서 친하게 지내요</p>
      </div>

      <ChannelPostCard />
      <ChannelPostCard />
      <ChannelPostCard />

      <button class="w-[570px] h-[66px] rounded-2xl text-center text-[20px] bg-white">더보기</button>
    </div>
    <!-- 챌린지 -->
    <div class="bg-[#F4F4F4] px-[15px] py-[72px]">
      <div>
        <p class="flex justify-center">
          <img src="@/assets/images/challenge.svg" alt="channelicon" class="inline-block text-[20px] mr-3 mb-9" />챌린지
        </p>
        <p class="text-[28px] mb-[25px] text-center">같은 목표를 가진<br />멤버들과 함께 도전해요</p>
      </div>

      <ChannelPostCard />
      <ChannelPostCard />
      <ChannelPostCard />

      <button class="w-[570px] h-[66px] rounded-2xl text-center text-[20px] bg-white">더보기</button>
    </div>
  </div>
</template>
<style scoped></style>
