<script setup>
import { ref } from "vue";
import { twMerge } from "tailwind-merge";

const categories = ref([
  {
    main: "푸드·드링크",
    sub: [
      { id: 1, name: "전체", src: "./src/assets/images/food.svg" },
      {
        id: 2,
        name: "맛집투어",
        src: "https://i.pinimg.com/474x/c5/9e/f8/c59ef8f400255c37f394291e5b11dd97.jpg",
      },
      { id: 3, name: "카페", src: "./src/assets/images/food.svg" },
      { id: 4, name: "베이킹", src: "./src/assets/images/food.svg" },
      { id: 5, name: "와인", src: "./src/assets/images/food.svg" },
      { id: 6, name: "요리", src: "./src/assets/images/food.svg" },
      { id: 7, name: "칵테일", src: "./src/assets/images/food.svg" },
      { id: 8, name: "디저트", src: "./src/assets/images/food.svg" },
    ],
  },
  {
    main: "자기계발",
    sub: [
      { id: 11, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 12, name: "자기계발", src: "./src/assets/images/food.svg" },
      { id: 13, name: "자기계발", src: "./src/assets/images/food.svg" },
      { id: 14, name: "자기계발", src: "./src/assets/images/food.svg" },
    ],
  },
  {
    main: "취미",
    sub: [
      { id: 21, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 22, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 23, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 24, name: "전체", src: "./src/assets/images/food.svg" },
    ],
  },
  {
    main: "파티·게임",
    sub: [
      { id: 31, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 32, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 33, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 34, name: "전체", src: "./src/assets/images/food.svg" },
    ],
  },
  {
    main: "문화·예술",
    sub: [
      { id: 41, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 42, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 43, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 44, name: "전체", src: "./src/assets/images/food.svg" },
    ],
  },
  {
    main: "연애·사랑",
    sub: [
      { id: 51, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 52, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 53, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 54, name: "전체", src: "./src/assets/images/food.svg" },
    ],
  },
  {
    main: "동네·또래",
    sub: [
      { id: 61, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 62, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 63, name: "전체", src: "./src/assets/images/food.svg" },
      { id: 64, name: "전체", src: "./src/assets/images/food.svg" },
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
          selectedCategory === index ? 'text-[black] border-[1px] border-black bg-white' : '',
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
      class="mr-7 text-center inline-block"
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
      <p class="mt-2">{{ subcategory.name }}</p>
    </div>
  </div>
</template>
<style scoped></style>
