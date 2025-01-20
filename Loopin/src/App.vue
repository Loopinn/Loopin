<script setup>
import { RouterLink } from "vue-router";
import { useRoute } from "vue-router";
import { computed } from "vue";

import LogoHeader from "@/components/header/LogoHeader.vue";
import CenteredHeader from "@/components/header/CenteredHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import PostCreateView from "./views/PostCreateView.vue";

const route = useRoute();

const isActive = (path) => route.path === path;

const links = [
  { name: "메인", path: "/" },
  { name: "소셜링", path: "/socialing" },
  { name: "클럽", path: "/club" },
  { name: "챌린지", path: "/challenge" },
  // { name: "라운지", path: "/lounge" },
  { name: "로그인", path: "/signIn" },
  { name: "회원가입", path: "/signUp" },
  // { name: "프로필", path: "/user" },
];

const headerComponent = computed(() => {
  const layoutName = route.meta.layout || "LogoHeader";
  return layoutName === "CenteredHeader" ? CenteredHeader : LogoHeader;
});
</script>
<template>
  <div v-if="route.path === '/write'">
    <PostCreateView />
  </div>
  <div v-else class="flex flex-col w-full h-full min-h-screen bg-white">
    <header>
      <component :is="headerComponent" />
    </header>
    <nav class="flex gap-3 w-full h-[50px] items-center px-3.5 sticky top-0 bg-white border-[#D9D9D9] border-b z-10">
      <RouterLink
        v-for="(link, index) in links"
        :key="index"
        :to="link.path"
        class="relative text-[#999996] hover:text-black"
        :class="{
          'text-black font-semibold after:absolute after:left-0 after:bottom-[-12px] after:w-full after:h-[2px] after:bg-black after:rounded-full':
            isActive(link.path),
        }"
      >
        {{ link.name }}
      </RouterLink>
    </nav>
    <div class="flex-grow mb-[64px]">
      <RouterView />
    </div>
    <footer
      class="flex fixed bottom-0 w-[600px] h-[64px] bg-[white] border-[#D9D9D9] border-t left-1/2 -translate-x-1/2"
    >
      <Footer />
    </footer>
  </div>
</template>
<style scoped></style>
