<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function navigate(index) {
  const routes = ["/", "/lounge", "/write", "/chat", "/user"];
  router.push(routes[index]);
}
</script>

<template>
  <div class="relative">
    <div class="w-[600px] h-[64px] bg-[#d9d9d9] flex items-center justify-around fixed bottom-0">
      <div
        v-for="(name, index) in ['Home', 'Lounge', 'Write', 'Chat', 'MyPage']"
        :key="index"
        class="w-[45px] h-[45px] bg-white rounded-full flex justify-center items-center cursor-pointer"
        @click="navigate(index)"
      >
        <span>{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
