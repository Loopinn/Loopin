<script setup>
import { ref } from "vue";

const subcategories = ref([
  { name: "맛집", src: "./src/assets/images/food.svg" },
  { name: "맛집", src: "./src/assets/images/food.svg" },
  { name: "맛집", src: "./src/assets/images/food.svg" },
  { name: "맛집", src: "./src/assets/images/food.svg" },
  { name: "맛집", src: "./src/assets/images/food.svg" },
]);

const selectedSubcategory = ref(0);

const clickSubcategory = (index) => {
  selectedSubcategory.value = index;
};
</script>
<template>
  <div v-for="(subcategory, index) in subcategories" :key="index" class="mb-[60px] mr-5 text-center inline-block">
    <button
      :class="[
        'w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center',
        selectedSubcategory === index ? 'border border-black' : '',
      ]"
      @click="clickSubcategory(index)"
    >
      <img :src="subcategory.src" alt="subcategoryicon" class="w-[30px] h-[30px]" />
    </button>
    <p class="w-[70px] mt-2">{{ subcategory.name }}</p>
  </div>
</template>
<style scoped></style>
