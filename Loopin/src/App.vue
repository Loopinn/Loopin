<script setup>
import { RouterLink } from "vue-router";
import { useRoute } from "vue-router";
import { computed } from "vue";

import LogoHeader from "@/components/header/LogoHeader.vue";
import CenteredHeader from "@/components/header/CenteredHeader.vue";
import Footer from "@/components/footer/Footer.vue";

const route = useRoute();

const headerComponent = computed(() => {
  const layoutName = route.meta.layout || "LogoHeader";
  return layoutName === "CenteredHeader" ? CenteredHeader : LogoHeader;
});
</script>
<template>
  <div class="flex flex-col w-full h-full min-h-screen bg-white">
    <header>
      <component :is="headerComponent" />
    </header>
    <nav class="flex gap-3">
      <RouterLink to="/">메인</RouterLink>
      <RouterLink to="/socialing">소셜링</RouterLink>
      <RouterLink to="/club">클럽</RouterLink>
      <RouterLink to="/challenge">챌린지</RouterLink>
      <RouterLink to="/lounge">라운지</RouterLink>
      <RouterLink to="/signIn">로그인</RouterLink>
      <RouterLink to="/signUp">회원가입</RouterLink>
      <RouterLink to="/user">프로필</RouterLink>
    </nav>
    <div class="flex-grow pb-[64px]">
      <RouterView />
    </div>
    <footer class="flex fixed bottom-0 w-[600px] h-[64px] bg-[#d9d9d9] left-1/2 -translate-x-1/2">
      <Footer />
    </footer>
  </div>
</template>
<style scoped></style>
