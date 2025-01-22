<script setup>
import ChannelCategory from "@/components/channel/ChannelCategory.vue";
import ChannelEmpty from "@/components/channel/ChannelEmpty.vue";
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
</script>
<template>
  <div class="mx-auto py-3 min-h-screen w-[600px] bg-[#F4F4F4]">
    <div class="mx-[15px]">
      <!-- categories -->
      <ChannelCategory />

      <!-- 게시물이 없을 경우 -->
      <ChannelEmpty />
      <!-- channelpostcard -->
      <ChannelPostCard />
      <ChannelPostCard />
      <ChannelPostCard />
    </div>
  </div>
</template>
<style scoped></style>
