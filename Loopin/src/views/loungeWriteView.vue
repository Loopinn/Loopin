<script setup>
import paper from "@/assets/images/paper.svg";
import addImage from "@/assets/images/addImages.svg";
import arrow from "@/assets/images/arrow-right.svg";
import FeedModal from "@/components/lounge/FeedModal.vue";
import { ref } from "vue";

const fileInput = ref(null);
const isModalOpen = ref(false);
const selectedItem = ref(null);

const selectedImages = ref([]);

// 파일 선택 후 이미지 미리보기
function handleFileChange(event) {
  const files = event.target.files;
  const fileArray = Array.from(files);

  // 선택된 파일들을 base64로 변환하여 selectedImages에 추가
  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (selectedImages.value.length < 10) {
        selectedImages.value.push(e.target.result);
      } else {
        alert("최대 10개의 이미지만 첨부할 수 있습니다.");
        return;
      }
    };
    reader.readAsDataURL(file);
  });
}
function triggerFileInput() {
  fileInput.value.click();
}
function openModal() {
  isModalOpen.value = true;
}
function handleSelect(item) {
  selectedItem.value = item;
}
function removeImage(index) {
  selectedImages.value.splice(index, 1);
}
</script>

<template>
  <div class="px-5 pt-6">
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
        <div class="flex items-center space-x-2">
          <div
            class="border rounded-lg flex flex-col items-center justify-center w-[128px] h-[128px] overflow-hidden shrink-0"
          >
            <img
              :src="addImage"
              alt="addImage"
              class="w-[64px] h-[64px] cursor-pointer ml-3"
              @click="triggerFileInput"
            />
            <input
              type="file"
              id="file"
              accept="image/*"
              class="hidden"
              ref="fileInput"
              multiple
              @change="handleFileChange"
            />
            <div class="text-sm text-gray-500">{{ selectedImages.length }}/10</div>
          </div>

          <div class="flex overflow-x-auto space-x-2 slide-container">
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="flex-shrink-0 w-[128px] h-[128px] relative"
            >
              <img :src="image" alt="Selected Image" class="w-full h-full object-cover border rounded-lg" />
              <button
                @click="removeImage(index)"
                class="absolute top-2 right-2 bg-black bg-opacity-30 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <span class="text-xl">&times;</span>
              </button>
            </div>
          </div>
        </div>
        <textarea
          class="mt-4 text-gray-500 w-full resize-none outline-none h-[200px]"
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
  background: #ffffff00;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}

.slide-container {
  scrollbar-width: thin;
  border-radius: 10px;
}
</style>
