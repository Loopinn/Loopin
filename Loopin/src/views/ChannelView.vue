<script setup>
import ChannelEmpty from "@/components/channel/ChannelEmpty.vue";
import ChannelPostCard from "@/components/channel/ChannelPostCard.vue";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { twMerge } from "tailwind-merge";

const postStore = usePostStore();
const { socialingPosts, clubPosts, challengePosts } = storeToRefs(postStore);
const { loadSocialPosts, loadClubPosts, loadChallengePosts } = postStore;

// 채널
const channels = [
  { title: "소셜링", name: "socialing", posts: socialingPosts, load: loadSocialPosts },
  { title: "클럽", name: "club", posts: clubPosts, load: loadClubPosts },
  { title: "챌린지", name: "challenge", posts: challengePosts, load: loadChallengePosts },
];

const currentChannel = ref(null);
const route = useRoute();
const router = useRouter();

// 카테고리
const categories = [
  {
    main: "푸드·드링크",
    sub: [
      { id: 1, name: "전체", src: "/categories/square-four.svg" },
      { id: 2, name: "맛집투어", src: "/categories/restaurant.jpg" },
      { id: 3, name: "카페", src: "/categories/cafe.jpg" },
      { id: 4, name: "베이킹", src: "/categories/baking.jpg" },
      { id: 5, name: "와인", src: "/categories/wine.jpg" },
      { id: 6, name: "요리", src: "/categories/cooking.jpg" },
      { id: 7, name: "전통주", src: "/categories/traditional-liquor.jpg" },
      { id: 8, name: "칵테일", src: "/categories/cocktail.jpg" },
      { id: 9, name: "디저트", src: "/categories/dessert.jpg" },
      { id: 10, name: "위스키", src: "/categories/whiskey.jpg" },
      { id: 11, name: "맥주", src: "/categories/beer.jpg" },
      { id: 12, name: "파인다이닝", src: "/categories/fine-dining.jpg" },
      { id: 13, name: "커피", src: "/categories/coffee.jpg" },
      { id: 14, name: "비건", src: "/categories/vegan.jpg" },
      { id: 15, name: "티룸", src: "/categories/tea-room.jpg" },
    ],
  },
  {
    main: "자기계발",
    sub: [
      { id: 16, name: "전체", src: "/categories/square-four.svg" },
      { id: 17, name: "독서", src: "/categories/reading.jpg" },
      { id: 18, name: "스터디", src: "/categories/study.jpg" },
      { id: 19, name: "대화", src: "/categories/conversation.jpg" },
      { id: 20, name: "스피치", src: "/categories/speech.jpg" },
      { id: 21, name: "사이드프로젝트", src: "/categories/side-project.jpg" },
      { id: 22, name: "커리어", src: "/categories/career.jpg" },
      { id: 23, name: "브랜딩", src: "/categories/branding.jpg" },
      { id: 24, name: "창작", src: "/categories/creation.jpg" },
    ],
  },
  {
    main: "취미",
    sub: [
      { id: 25, name: "전체", src: "/categories/square-four.svg" },
      { id: 26, name: "사진", src: "/categories/photo.jpg" },
      { id: 27, name: "드로잉", src: "/categories/drawing.jpg" },
      { id: 28, name: "공예", src: "/categories/craft.jpg" },
      { id: 29, name: "노래", src: "/categories/singing.jpg" },
      { id: 30, name: "글쓰기", src: "/categories/writing.jpg" },
      { id: 31, name: "댄스", src: "/categories/dance.jpg" },
      { id: 32, name: "뷰티", src: "/categories/beauty.jpg" },
      { id: 33, name: "봉사활동", src: "/categories/volunteer.jpg" },
      { id: 34, name: "스타일링", src: "/categories/styling.jpg" },
      { id: 35, name: "향수", src: "/categories/perfume.jpg" },
      { id: 36, name: "악기연주", src: "/categories/instrument.jpg" },
      { id: 37, name: "음악감상", src: "/categories/music-listening.jpg" },
      { id: 38, name: "만화", src: "/categories/comic.jpg" },
      { id: 39, name: "명상", src: "/categories/meditation.jpg" },
      { id: 40, name: "반려동물", src: "/categories/pets.jpg" },
      { id: 41, name: "캘리그라피", src: "/categories/calligraphy.jpg" },
      { id: 42, name: "쇼핑", src: "/categories/shopping.jpg" },
    ],
  },
  {
    main: "파티·게임",
    sub: [
      { id: 43, name: "전체", src: "/categories/square-four.svg" },
      { id: 44, name: "컨셉파티", src: "/categories/concept-party.jpg" },
      { id: 45, name: "포틀럭파티", src: "/categories/potluck-party.jpg" },
      { id: 46, name: "내향인파티", src: "/categories/introvert-party.jpg" },
      { id: 47, name: "푸드파티", src: "/categories/food-party.jpg" },
      { id: 48, name: "와인파티", src: "/categories/wine-party.jpg" },
      { id: 49, name: "홈파티", src: "/categories/home-party.jpg" },
      { id: 50, name: "뮤직파티", src: "/categories/music-party.jpg" },
      { id: 51, name: "생일파티", src: "/categories/birthday-party.jpg" },
      { id: 52, name: "보드게임", src: "/categories/board-game.jpg" },
      { id: 53, name: "추리게임", src: "/categories/mystery-game.jpg" },
      { id: 54, name: "컨셉게임", src: "/categories/concept-game.jpg" },
      { id: 55, name: "방탕출", src: "/categories/room-escape.jpg" },
      { id: 56, name: "온라인게임", src: "/categories/online-game.jpg" },
      { id: 57, name: "운동회", src: "/categories/sports-day.jpg" },
      { id: 58, name: "액팅게임", src: "/categories/acting-game.jpg" },
    ],
  },
  {
    main: "문화·예술",
    sub: [
      { id: 59, name: "전체", src: "/categories/square-four.svg" },
      { id: 60, name: "전시", src: "/categories/exhibition.jpg" },
      { id: 61, name: "영화", src: "/categories/movie.jpg" },
      { id: 62, name: "뮤지컬", src: "/categories/musical.jpg" },
      { id: 63, name: "공연", src: "/categories/show.jpg" },
      { id: 64, name: "연극", src: "/categories/play.jpg" },
      { id: 65, name: "페스티벌", src: "/categories/festival.jpg" },
      { id: 66, name: "팝업", src: "/categories/popup.jpg" },
      { id: 67, name: "연주회", src: "/categories/recital.jpg" },
    ],
  },
  {
    main: "연애·사랑",
    sub: [
      { id: 68, name: "전체", src: "/categories/square-four.svg" },
      { id: 69, name: "로테이션소개팅", src: "/categories/rotation-dating.jpg" },
      { id: 70, name: "컨셉소개팅", src: "/categories/concept-dating.jpg" },
      { id: 71, name: "대화형소개팅", src: "/categories/conversation-dating.jpg" },
      { id: 72, name: "연애탐구생활", src: "/categories/relationship-exploration.jpg" },
      { id: 73, name: "콘텐츠소개팅", src: "/categories/content-dating.jpg" },
      { id: 74, name: "와인미팅", src: "/categories/wine-meeting.jpg" },
    ],
  },
  {
    main: "동네·또래",
    sub: [
      { id: 75, name: "전체", src: "/categories/square-four.svg" },
      { id: 76, name: "또래친구", src: "/categories/peer-friends.jpg" },
      { id: 77, name: "동네친구", src: "/categories/neighborhood-friends.jpg" },
      { id: 78, name: "취향친구", src: "/categories/preference-friends.jpg" },
    ],
  },
];

const selectedMainCategory = ref("푸드·드링크");
const selectedSubCategory = ref("전체");

// 카테고리 클릭 메서드
const clickMainCategory = (maincategory) => {
  selectedMainCategory.value = maincategory;
  selectedSubCategory.value = "전체";
  router.push({ path: `/${currentChannel.value.name}/${selectedMainCategory.value}/${selectedSubCategory.value}` });
};
const clickSubCategory = (subcategory) => {
  selectedSubCategory.value = subcategory;
  router.push({ path: `/${currentChannel.value.name}/${selectedMainCategory.value}/${selectedSubCategory.value}` });
};

// 서브 카테고리 가져오기
const getSubCategories = (maincategory) => {
  const isCategory = categories.find((cat) => cat.main === maincategory);
  return isCategory ? isCategory.sub : [];
};

// 게시글 필터링
const filteredPosts = computed(() => {
  const currentPosts = currentChannel.value.posts || [];

  if (selectedMainCategory) {
    if (selectedSubCategory.value === "전체") {
      return currentPosts.filter((post) => post.subject === selectedMainCategory.value);
    } else {
      return currentPosts.filter(
        (post) => post.subject === selectedMainCategory.value && post.category === selectedSubCategory.value,
      );
    }
  }
});

// 컴포넌트 초기화
onBeforeMount(() => {
  currentChannel.value = channels.find((channel) => channel.name === route.path.split("/")[1]);

  if (currentChannel.value) {
    currentChannel.value.load();
  } else {
    console.log("currentChannel error");
  }

  const { maincategory, subcategory } = route.params;
  if (maincategory) {
    selectedMainCategory.value = maincategory;
  }
  if (subcategory) {
    selectedSubCategory.value = subcategory;
  }
});

// 라우트 변경 감지
watch(
  () => route.path,
  (newPath) => {
    const newChannel = channels.find((channel) => channel.name === newPath.split("/")[1]);
    if (newChannel) {
      currentChannel.value = newChannel;
      currentChannel.value.load(); // 새로운 채널 데이터 로드
      if (newPath === "/socialing" || newPath === "/club" || newPath === "/challenge")
        selectedMainCategory.value = "푸드·드링크";
      selectedSubCategory.value = "전체";
    } else {
      console.log("currentChannel error");
    }
  },
);

watch(
  () => route.params,
  (params) => {
    if (params.category) {
      selectedMainCategory.value = params.category;
    }
    if (params.subcategory) {
      selectedSubCategory.value = params.subcategory;
    }
  },
);

// 카테고리 가로 스크롤
const scrollContainer = ref(null);

const handleWheel = (event) => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft += event.deltaY;
    event.preventDefault();
  }
};
</script>
<template>
  <div class="mx-auto min-h-[calc(100vh-195px)] w-[600px] bg-[#F4F4F4]">
    <div class="mx-[15px]">
      <!-- categories -->
      <div
        class="sticky z-[5] top-0 bg-[#f4f4f4] before:block before:h-[15px] before:w-full before:bg-[#f4f4f4] after:block after:h-[15px] after:w-full after:bg-[#f4f4f4]"
      >
        <div class="mb-7 pl-1">
          <div
            v-for="(maincategory, index) in categories"
            :key="index"
            :class="[
              twMerge(
                'text-[#8A8A8A] text-[14px] rounded-2xl inline-block px-2 py-1 mr-[6px] mb-2 border border-[#D9D9D9] cursor-pointer',
                selectedMainCategory === maincategory.main ? 'text-[black] border-2 border-black bg-white' : '',
              ),
            ]"
            @click="clickMainCategory(maincategory.main)"
          >
            {{ maincategory.main }}
          </div>
        </div>
        <div ref="scrollContainer" class="flex overflow-x-scroll scrollbar-hide" @wheel="handleWheel">
          <div
            v-for="(subcategory, subIndex) in getSubCategories(selectedMainCategory)"
            :key="subcategory.id"
            class="mr-7 text-center flex flex-col items-center"
          >
            <div
              :class="[
                'w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center cursor-pointer',
                selectedSubCategory === subcategory.name ? 'border-2 border-black' : '',
              ]"
              @click="clickSubCategory(subcategory.name)"
            >
              <img
                :src="subcategory.src"
                alt="subcategoryicon"
                :class="subIndex === 0 ? 'w-[30px] h-[30px]' : 'w-[60px] h-[60px] rounded-full'"
              />
            </div>
            <p class="mt-2 whitespace-nowrap">{{ subcategory.name }}</p>
          </div>
        </div>
      </div>
      <!-- 게시글 목록 -->

      <div v-if="filteredPosts?.length" class="flex flex-col gap-6 pb-6">
        <div v-for="post in filteredPosts" :key="post.id">
          <RouterLink :to="{ path: `/${currentChannel.name}/${post.id}` }">
            <ChannelPostCard :post="post" :channelName="currentChannel.title" />
          </RouterLink>
        </div>
      </div>
      <!-- 게시물이 없을 경우 -->
      <ChannelEmpty v-else />
    </div>
  </div>
</template>
<style scoped></style>
