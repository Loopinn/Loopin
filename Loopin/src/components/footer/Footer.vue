<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function navigate(index) {
  const routes = ["/", "/lounge", "/write", "/chat", "/user"];
  router.push(routes[index]);
}
</script>

<template>
  <div class="w-full flex items-center justify-around">
    <div
      v-for="(name, index) in ['Home', 'Lounge', 'Write', 'Chat', 'MyPage']"
      :key="index"
      class="w-[45px] h-[45px] bg-white rounded-full flex justify-center items-center cursor-pointer"
      @click="navigate(index)"
    >
      <span>{{ name }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
