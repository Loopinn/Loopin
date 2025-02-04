<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import homeFooterIcon from "@/assets/images/home-footer.svg";
import homeFooterActiveIcon from "@/assets/images/home-active-footer.svg";
import loungeFooterIcon from "@/assets/images/lounge-footer.svg";
import loungeFooterActiveIcon from "@/assets/images/lounge-active-footer.svg";
import writeFooterIcon from "@/assets/images/post-footer.svg";
import chatFooterIcon from "@/assets/images/chat-footer.svg";
import chatFooterActiveIcon from "@/assets/images/chat-active-footer.svg";
import userFooterIcon from "@/assets/images/user-footer.svg";
import userFooterActiveIcon from "@/assets/images/user-active-footer.svg";

const router = useRouter();
const route = useRoute();

function navigate(index) {
  const routes = ["/", "/lounge", "/write", "/chat", "/profile"];
  router.push(routes[index]);
}

const footerItems = [
  {
    text: "홈",
    img: homeFooterIcon,
    activeImg: homeFooterActiveIcon,
    route: "/",
    isActive: computed(
      () => route.path === "/" || ["/socialing", "/club", "/challenge"].some((prefix) => route.path.startsWith(prefix)),
    ),
  },
  {
    text: "라운지",
    img: loungeFooterIcon,
    activeImg: loungeFooterActiveIcon,
    route: "/lounge",
    isActive: computed(() => route.path.startsWith("/lounge")),
  },
  {
    text: null,
    img: writeFooterIcon,
    activeImg: null,
    route: "/write",
    isActive: computed(() => route.path === "/write"),
  },
  {
    text: "채팅",
    img: chatFooterIcon,
    activeImg: chatFooterActiveIcon,
    route: "/chat",
    isActive: computed(() => route.path === "/chat"),
  },
  {
    text: "마이페이지",
    img: userFooterIcon,
    activeImg: userFooterActiveIcon,
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
