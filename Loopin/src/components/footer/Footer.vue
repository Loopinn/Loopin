<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

function navigate(index) {
  const routes = ["/", "/lounge", "/write", "/chat", "/profile"];
  router.push(routes[index]);
}

const footerItems = [
  {
    text: "홈",
    img: "/src/assets/images/home-footer.svg",
    activeImg: "/src/assets/images/home-active-footer.svg",
    route: "/",
    isActive: computed(
      () => route.path === "/" || ["/socialing", "/club", "/challenge"].some((prefix) => route.path.startsWith(prefix)),
    ),
  },
  {
    text: "라운지",
    img: "/src/assets/images/lounge-footer.svg",
    activeImg: "/src/assets/images/lounge-active-footer.svg",
    route: "/lounge",
    isActive: computed(() => route.path.startsWith("/lounge")),
  },
  {
    text: null,
    img: "/src/assets/images/post-footer.svg",
    activeImg: null,
    route: "/write",
    isActive: computed(() => route.path === "/write"),
  },
  {
    text: "채팅",
    img: "/src/assets/images/chat-footer.svg",
    activeImg: "/src/assets/images/chat-active-footer.svg",
    route: "/chat",
    isActive: computed(() => route.path === "/chat"),
  },
  {
    text: "마이페이지",
    img: "/src/assets/images/user-footer.svg",
    activeImg: "/src/assets/images/user-active-footer.svg",
    route: "/profile",
    isActive: computed(() => route.path === "/profile"),
  },
];

// 현재 페이지 아이콘 확인 함수
const getImageUrl = (path) => {
  return new URL(path, import.meta.url).href;
};

const getIcon = (item) => {
  return item.isActive.value ? getImageUrl(item.activeImg) : getImageUrl(item.img);
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
