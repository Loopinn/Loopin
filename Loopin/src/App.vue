<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import supabase from "@/config/supabase";
import { logout } from "@/utils/auth/logout";

import LogoHeader from "@/components/header/LogoHeader.vue";
import CenteredHeader from "@/components/header/CenteredHeader.vue";
import Footer from "@/components/footer/Footer.vue";
import ChoiceModal from "./components/modal/ChoiceModal.vue";

const route = useRoute();
const router = useRouter();
const userLoggedIn = ref(false);
const userData = ref(null);
const isModalOpen = ref(false);
const modalMessage = ref("<b style='font-size: 22px; color: #000;'>로그아웃 하시겠습니까?</b>");

const isActive = (path) => route.path === path;

const fetchSession = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session) {
    userLoggedIn.value = true;
    userData.value = sessionData.session.user;
  } else {
    userLoggedIn.value = false;
    userData.value = null;
  }
};

const handleLogout = async () => {
  try {
    await logout();
    userLoggedIn.value = false;
    userData.value = null;
    toggleModal(); // 로그아웃 후 모달 닫기
    router.push("/");
  } catch (error) {
    console.log("로그아웃 중 에러 발생: ", error);
  }
};

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

// 임시
const links = computed(() => {
  const baseLinks = [
    { name: "메인", path: "/" },
    { name: "소셜링", path: "/socialing" },
    { name: "클럽", path: "/club" },
    { name: "챌린지", path: "/challenge" },
    { name: "라운지", path: "/lounge" },
  ];
  if (userLoggedIn.value) {
    return [...baseLinks, { name: "프로필", path: "/user" }];
  } else {
    return [...baseLinks, { name: "로그인", path: "/signIn" }, { name: "회원가입", path: "/signUp" }];
  }
});

const headerComponent = computed(() => {
  const layoutName = route.meta.layout || "LogoHeader";
  return layoutName === "CenteredHeader" ? CenteredHeader : LogoHeader;
});

onMounted(() => {
  fetchSession();
});

watch(
  () => route.meta.layout,
  () => {
    fetchSession();
  },
);
</script>
<template>
  <div class="flex flex-col w-full h-full min-h-screen bg-white">
    <header>
      <component :is="headerComponent" />
    </header>
    <nav class="flex gap-3 h-[48px] items-center ml-3.5">
      <RouterLink
        v-for="(link, index) in links"
        :key="index"
        :to="link.path"
        class="relative text-[#999996] hover:text-black"
        :class="{
          'text-black font-semibold after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-black':
            isActive(link.path),
        }"
      >
        {{ link.name }}
      </RouterLink>
      <button v-if="userLoggedIn" @click="toggleModal" class="text-[#999996] hover:text-black">로그아웃</button>
      <ChoiceModal
        :isOpen="isModalOpen"
        :message="modalMessage"
        :buttonMessage="'로그아웃'"
        @confirm="handleLogout"
        @close="toggleModal"
      >
      </ChoiceModal>
    </nav>
    <div class="flex-grow mb-[64px]">
      <RouterView />
    </div>
    <footer class="flex fixed bottom-0 w-[600px] h-[64px] bg-[white] border-t left-1/2 -translate-x-1/2">
      <Footer />
    </footer>
  </div>
</template>
<style scoped></style>
