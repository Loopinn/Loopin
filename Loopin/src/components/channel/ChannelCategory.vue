<script setup>
import { ref } from "vue";
import { twMerge } from "tailwind-merge";

const categories = ref([
  {
    main: "푸드·드링크",
    sub: [
      { id: 1, name: "전체", src: "./src/assets/images/categories/square-four.svg" },
      { id: 2, name: "맛집투어", src: "./src/assets/images/categories/restaurant.jpg" },
      { id: 3, name: "카페", src: "./src/assets/images/categories/cafe.jpg" },
      { id: 4, name: "베이킹", src: "./src/assets/images/categories/baking.jpg" },
      { id: 5, name: "와인", src: "./src/assets/images/categories/wine.jpg" },
      { id: 6, name: "요리", src: "./src/assets/images/categories/cooking.jpg" },
      { id: 7, name: "전통주", src: "./src/assets/images/categories/traditional-liquor.jpg" },
      { id: 8, name: "칵테일", src: "./src/assets/images/categories/cocktail.jpg" },
      { id: 9, name: "디저트", src: "./src/assets/images/categories/dessert.jpg" },
      { id: 10, name: "위스키", src: "./src/assets/images/categories/whiskey.jpg" },
      { id: 11, name: "맥주", src: "./src/assets/images/categories/beer.jpg" },
      { id: 12, name: "파인다이닝", src: "./src/assets/images/categories/fine-dining.jpg" },
      { id: 13, name: "커피", src: "./src/assets/images/categories/coffee.jpg" },
      { id: 14, name: "비건", src: "./src/assets/images/categories/vegan.jpg" },
      { id: 15, name: "티룸", src: "./src/assets/images/categories/tea-room.jpg" },
    ],
  },
  {
    main: "자기계발",
    sub: [
      { id: 16, name: "전체", src: "./src/assets/images/categories/square-four.svg" },
      { id: 17, name: "독서", src: "./src/assets/images/categories/reading.jpg" },
      { id: 18, name: "스터디", src: "./src/assets/images/categories/study.jpg" },
      { id: 19, name: "대화", src: "./src/assets/images/categories/conversation.jpg" },
      { id: 20, name: "스피치", src: "./src/assets/images/categories/speech.jpg" },
      { id: 21, name: "사이드프로젝트", src: "./src/assets/images/categories/side-project.jpg" },
      { id: 22, name: "커리어", src: "./src/assets/images/categories/career.jpg" },
      { id: 23, name: "브랜딩", src: "./src/assets/images/categories/branding.jpg" },
      { id: 24, name: "창작", src: "./src/assets/images/categories/creation.jpg" },
    ],
  },
  {
    main: "취미",
    sub: [
      { id: 25, name: "전체", src: "./src/assets/images/categories/square-four.svg" },
      { id: 26, name: "사진", src: "./src/assets/images/categories/photo.jpg" },
      { id: 27, name: "드로잉", src: "./src/assets/images/categories/drawing.jpg" },
      { id: 28, name: "공예", src: "./src/assets/images/categories/craft.jpg" },
      { id: 29, name: "노래", src: "./src/assets/images/categories/singing.jpg" },
      { id: 30, name: "글쓰기", src: "./src/assets/images/categories/writing.jpg" },
      { id: 31, name: "댄스", src: "./src/assets/images/categories/dance.jpg" },
      { id: 32, name: "뷰티", src: "./src/assets/images/categories/beauty.jpg" },
      { id: 33, name: "봉사활동", src: "./src/assets/images/categories/volunteer.jpg" },
      { id: 34, name: "스타일링", src: "./src/assets/images/categories/styling.jpg" },
      { id: 35, name: "향수", src: "./src/assets/images/categories/perfume.jpg" },
      { id: 36, name: "악기연주", src: "./src/assets/images/categories/instrument.jpg" },
      { id: 37, name: "음악감상", src: "./src/assets/images/categories/music-listening.jpg" },
      { id: 38, name: "만화", src: "./src/assets/images/categories/comic.jpg" },
      { id: 39, name: "명상", src: "./src/assets/images/categories/meditation.jpg" },
      { id: 40, name: "반려동물", src: "./src/assets/images/categories/pets.jpg" },
      { id: 41, name: "캘리그라피", src: "./src/assets/images/categories/calligraphy.jpg" },
      { id: 42, name: "쇼핑", src: "./src/assets/images/categories/shopping.jpg" },
    ],
  },
  {
    main: "파티·게임",
    sub: [
      { id: 43, name: "전체", src: "./src/assets/images/categories/square-four.svg" },
      { id: 44, name: "컨셉파티", src: "./src/assets/images/categories/concept-party.jpg" },
      { id: 45, name: "포틀럭파티", src: "./src/assets/images/categories/potluck-party.jpg" },
      { id: 46, name: "내향인파티", src: "./src/assets/images/categories/introvert-party.jpg" },
      { id: 47, name: "푸드파티", src: "./src/assets/images/categories/food-party.jpg" },
      { id: 48, name: "와인파티", src: "./src/assets/images/categories/wine-party.jpg" },
      { id: 49, name: "홈파티", src: "./src/assets/images/categories/home-party.jpg" },
      { id: 50, name: "뮤직파티", src: "./src/assets/images/categories/music-party.jpg" },
      { id: 51, name: "생일파티", src: "./src/assets/images/categories/birthday-party.jpg" },
      { id: 52, name: "보드게임", src: "./src/assets/images/categories/board-game.jpg" },
      { id: 53, name: "추리게임", src: "./src/assets/images/categories/mystery-game.jpg" },
      { id: 54, name: "컨셉게임", src: "./src/assets/images/categories/concept-game.jpg" },
      { id: 55, name: "방탕출", src: "./src/assets/images/categories/room-escape.jpg" },
      { id: 56, name: "온라인게임", src: "./src/assets/images/categories/online-game.jpg" },
      { id: 57, name: "운동회", src: "./src/assets/images/categories/sports-day.jpg" },
      { id: 58, name: "액팅게임", src: "./src/assets/images/categories/acting-game.jpg" },
    ],
  },
  {
    main: "문화·예술",
    sub: [
      { id: 59, name: "전체", src: "./src/assets/images/categories/square-four.svg" },
      { id: 60, name: "전시", src: "./src/assets/images/categories/exhibition.jpg" },
      { id: 61, name: "영화", src: "./src/assets/images/categories/movie.jpg" },
      { id: 62, name: "뮤지컬", src: "./src/assets/images/categories/musical.jpg" },
      { id: 63, name: "공연", src: "./src/assets/images/categories/show.jpg" },
      { id: 64, name: "연극", src: "./src/assets/images/categories/play.jpg" },
      { id: 65, name: "페스티벌", src: "./src/assets/images/categories/festival.jpg" },
      { id: 66, name: "팝업", src: "./src/assets/images/categories/popup.jpg" },
      { id: 67, name: "연주회", src: "./src/assets/images/categories/recital.jpg" },
    ],
  },
  {
    main: "연애·사랑",
    sub: [
      { id: 68, name: "전체", src: "./src/assets/images/categories/square-four.svg" },
      { id: 69, name: "로테이션소개팅", src: "./src/assets/images/categories/rotation-dating.jpg" },
      { id: 70, name: "컨셉소개팅", src: "./src/assets/images/categories/concept-dating.jpg" },
      { id: 71, name: "대화형소개팅", src: "./src/assets/images/categories/conversation-dating.jpg" },
      { id: 72, name: "연애탐구생활", src: "./src/assets/images/categories/relationship-exploration.jpg" },
      { id: 73, name: "콘텐츠소개팅", src: "./src/assets/images/categories/content-dating.jpg" },
      { id: 74, name: "와인미팅", src: "./src/assets/images/categories/wine-meeting.jpg" },
    ],
  },
  {
    main: "동네·또래",
    sub: [
      { id: 75, name: "전체", src: "./src/assets/images/categories/square-four.svg" },
      { id: 76, name: "또래친구", src: "./src/assets/images/categories/peer-friends.jpg" },
      { id: 77, name: "동네친구", src: "./src/assets/images/categories/neighborhood-friends.jpg" },
      { id: 78, name: "취향친구", src: "./src/assets/images/categories/preference-friends.jpg" },
    ],
  },
]);

const selectedCategory = ref(0);
const selectedSubcategory = ref(Array.isArray(categories.value[0].sub) ? categories.value[0].sub[0]?.id : 0);

const clickCategory = (index) => {
  selectedCategory.value = index;
  selectedSubcategory.value = Array.isArray(categories.value[index].sub) ? categories.value[index].sub[0]?.id : 0;
};

const clickSubcategory = (id) => {
  selectedSubcategory.value = id;
};

const scrollContainer = ref(null);

const handleWheel = (event) => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft += event.deltaY;
    event.preventDefault();
  }
};
</script>
<template>
  <div class="mb-7 pl-1">
    <div
      v-for="(category, index) in categories"
      :key="index"
      :class="[
        twMerge(
          'text-[#8A8A8A] text-[14px] rounded-2xl inline-block px-2 py-1 mr-[6px] mb-2 border border-[#D9D9D9] cursor-pointer',
          selectedCategory === index ? 'text-[black] border-2 border-black bg-white' : '',
        ),
      ]"
      @click="clickCategory(index)"
    >
      {{ category.main }}
    </div>
  </div>
  <div ref="scrollContainer" class="mb-[60px] flex overflow-x-scroll scrollbar-hide" @wheel="handleWheel">
    <div
      v-for="(subcategory, subIndex) in categories[selectedCategory].sub"
      :key="subcategory.id"
      class="mr-7 text-center flex flex-col items-center"
    >
      <div
        :class="[
          'w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center cursor-pointer',
          selectedSubcategory === subcategory.id ? 'border-2 border-black' : '',
        ]"
        @click="clickSubcategory(subcategory.id)"
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
</template>
<style scoped></style>
