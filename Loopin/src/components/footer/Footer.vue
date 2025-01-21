<script setup>
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

function navigate(index) {
  const routes = ["/", "/lounge", "/write", "/chat", "/user"];
  router.push(routes[index]);
}

const footerItems = [
  {
    text: "홈",
    img: "/src/assets/images/home-footer.svg",
    activeImg: "/src/assets/images/home-active-footer.svg",
    route: "/",
  },
  {
    text: "라운지",
    img: "/src/assets/images/lounge-footer.svg",
    activeImg: "/src/assets/images/lounge-active-footer.svg",
    route: "/lounge",
  },
  { text: null, img: "/src/assets/images/post-footer.svg", activeImg: null, route: "/write" },
  {
    text: "채팅",
    img: "/src/assets/images/chat-footer.svg",
    activeImg: "/src/assets/images/chat-active-footer.svg",
    route: "/chat",
  },
  {
    text: "마이페이지",
    img: "/src/assets/images/user-footer.svg",
    activeImg: "/src/assets/images/user-active-footer.svg",
    route: "/user",
  },
];

const getImageUrl = (path) => {
  return new URL(path, import.meta.url).href;
};
// 현재 페이지 아이콘 확인 함수
const getIcon = (item) => {
  const activeRoutes = ["/", "/socialing", "/club", "/challenge"]; // 홈 아이콘을 활성화할 경로들
  if (item.route === "/" && activeRoutes.includes(route.path)) {
    return getImageUrl(item.activeImg);
  }
  return route.path === item.route ? getImageUrl(item.activeImg) : getImageUrl(item.img);
};
</script>

<template>
  <div class="w-full flex items-center justify-around">
    <div
      v-for="(item, index) in footerItems"
      :key="index"
      class="w-[45px] h-[45px] text-[12px] flex flex-col justify-center items-center cursor-pointer"
      @click="navigate(index)"
    >
      <img :src="getIcon(item)" alt="" />
      <span class="whitespace-nowrap">{{ item.text }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
