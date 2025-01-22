<script setup>
import { ref } from "vue";

const props = defineProps({
  isModalOpen: {
    type: Boolean,
  },
});
const items = ref([
  "푸드·드링크",
  "자기계발",
  "취미",
  "엑티비티",
  "피티",
  "소셜게임",
  "문화·예술",
  "N잡·재태크",
  "연애·사랑",
  "여행·나들이",
  "동네·또래",
  "외국어",
]);
const selectedItem = ref(null); 
const emit = defineEmits(["close", "select"]);

function closeModal() {
  emit("close");
}

function handleSelection(item) {
  selectedItem.value = item; 
  emit("select", item);
  setTimeout(() => {
    closeModal(); 
  }, 100);
}
</script>

<template>
  <div>
    <!-- 모달 -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <div
        class="bg-white border-t rounded-t-3xl w-[600px] h-[500px] overflow-auto container transform transition-transform duration-300"
        :class="{ 'translate-y-0': isModalOpen, 'translate-y-full': !isModalOpen }"
      >
        <!-- 헤더 -->
        <div class="flex items-center p-4 border-b bg-white sticky top-0 z-10">
          <h2 class="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">주제 선택</h2>
          <button @click="closeModal" class="ml-auto text-xl">&times;</button>
        </div>
        <!-- 리스트 -->
        <ul class="divide-y">
          <li
            v-for="(item, index) in items"
            :key="index"
            class="flex justify-between p-4 cursor-pointer"
          >
            <span @click="handleSelection(item)">{{ item }}</span>
            <input
              type="radio"
              name="topic"
              :id="`topic-${index}`"
              :value="item"
              v-model="selectedItem"
              @change="handleSelection(item)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container::-webkit-scrollbar {
  width: 4px;
}

.container::-webkit-scrollbar-thumb {
  background-color: #ffffff00;
  border-radius: 10px;
}
.translate-y-full {
  transform: translateY(100%);
}

.translate-y-0 {
  transform: translateY(0);
}
</style>
