<script setup>
import socialingLogo from "@/assets/images/socialing.svg";
import clubLogo from "@/assets/images/club.svg";
import challengeLogo from "@/assets/images/challenge.svg";
import loungeLogo from "@/assets/images/loungeLogo.svg";
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import MoreBtn from "@/components/common/MoreBtn.vue";
import PageInfoSection from "@/components/common/PageInfoSection.vue";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const postStore = usePostStore();
const { socialingPosts, clubPosts, challengePosts, loungePosts } = storeToRefs(postStore);
const { loadSocialPosts, loadClubPosts, loadChallengePosts, loadLoungePosts } = postStore;

const channelviews = ref([
  {
    icon: socialingLogo,
    alt: "socailingLogo",
    title: "소셜링",
    subtitle: "똑같은 일상을 다채롭게 만들어 줄\n 원데이 취향 모임으로 만나요",
    route: "/socialing",
    posts: socialingPosts,
    load: loadSocialPosts,
  },
  {
    icon: clubLogo,
    alt: "clubLogo",
    title: "클럽",
    subtitle: "지속형 모임으로\n 계속해서 친하게 지내요",
    route: "/club",
    posts: clubPosts,
    load: loadClubPosts,
  },
  {
    icon: challengeLogo,
    alt: "chanllengeLogo",
    title: "챌린지",
    subtitle: "같은 목표를 가진\n 멤버들과 함께 도전해요",
    route: "/challenge",
    posts: challengePosts,
    load: loadChallengePosts,
  },
]);

onMounted(() => {
  channelviews.value.forEach((channel) => {
    channel.load();
  });
  loadLoungePosts();
});
</script>
<template>
  <div class="w-[600px] mx-auto">
    <div
      class="h-[290px] pl-7 bg-[#d9d9d9] bg-cover"
      style="
        background-image: url(&quot;https://whale-store.pstatic.net/20241218_299/1734504926246YrSbP_JPEG/2nd-008-Seungho_Choi.jpg&quot;);
      "
    >
      <p class="text-[30px] pt-[53px] mb-[6px] text-white">취향과 관심이<br />만나는 커뮤니티</p>
      <p class="text-[20px] text-white">우리의 이야기가 시작되는 곳, 루핀</p>
    </div>
    <div class="bg-[#F4F4F4] px-7 py-[72px]">
      <div v-for="(channelview, index) in channelviews" :key="index" class="mb-[144px] flex flex-col gap-[24px]">
        <PageInfoSection
          :icon="channelview.icon"
          :title="channelview.title"
          :subtitle="channelview.subtitle"
          :alt="channelview.alt"
          class="mb-7"
        />
        <div v-for="post in channelview.posts.slice(-3)" :key="post.id">
          <RouterLink :to="{ path: `${channelview.route}/${post.id}` }">
            <ChannelPostCard :post="post" :channelName="channelview.title" />
          </RouterLink>
        </div>

        <MoreBtn :link="channelview.route" />
      </div>

      <!-- 라운지 -->
      <div class="">
        <PageInfoSection
          :icon="loungeLogo"
          title="라운지"
          subtitle="비슷한 관심사를 가진
        멤버들의 취향 피드 구독하기"
          alt="라운지 로고"
          class="mb-7"
        />
        <div class="grid grid-cols-2 gap-4">
          <div v-for="feed in loungePosts.slice(-4)" :key="feed.id">
            <RouterLink :to="{ path: `/lounge/${feed.id}` }">
              <img
                :src="feed.images[0] || noImage"
                :alt="feed.description"
                class="w-full aspect-square object-cover rounded-xl"
              />
            </RouterLink>
          </div>
        </div>
        <MoreBtn link="/lounge" css="mt-6" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
