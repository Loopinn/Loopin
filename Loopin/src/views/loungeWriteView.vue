<script setup>
import paper from "@/assets/images/paper.svg";
import addImage from "@/assets/images/addImages.svg";
import arrow from "@/assets/images/arrow-right.svg";
import FeedModal from "@/components/lounge/FeedModal.vue";
import { ref } from "vue";

const fileInput = ref(null);
const isModalOpen = ref(false);
const selectedItem = ref(null);

function triggerFileInput() {
  fileInput.value.click();
}
function openModal() {
  isModalOpen.value = true;
}
function handleSelect(item) {
  selectedItem.value = item;
}
</script>

<template>
  <div class="px-5 py-6">
    <div class="relative flex items-center">
      <h1 class="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">피드 쓰기</h1>
      <button class="ml-auto text-red-500">올리기</button>
    </div>
    <div class="border-t mt-4 pt-4 h-full">
      <div class="flex justify-between items-center space-x-2 cursor-pointer" @click="openModal">
        <div class="flex items-center space-x-2">
          <img :src="paper" alt="paper" class="w-6 h-6" />
          <span class="text-gray-500">{{ selectedItem || "주제 선택" }}</span>
        </div>
        <img :src="arrow" alt="arrow" class="w-4 h-4" />
      </div>
      <div class="mt-4 border-t pt-5">
        <div class="border rounded-lg flex flex-col items-center justify-center w-32 h-32">
          <img :src="addImage" alt="addImage" class="w-16 h-16 ml-4 mt-2 cursor-pointer" @click="triggerFileInput" />
          <input type="file" id="file" accept="image/*" class="hidden" ref="fileInput" multiple />
          <div class="text-sm text-gray-500">0/10</div>
        </div>
        <textarea
          class="mt-4 text-gray-500 w-full resize-none outline-none h-[210px]"
          placeholder="오늘 어떤 것을 보고, 느끼고, 생각하셨나요?"
        ></textarea>
      </div>
    </div>
  </div>
  <FeedModal v-if="isModalOpen" :isModalOpen="isModalOpen" @close="isModalOpen = false" @select="handleSelect" />
</template>

<style scoped>
textarea {
  resize: none;
  outline: none;
}

textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
