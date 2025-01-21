<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: "Loopin입니다.",
  },
  buttonMessage: {
    type: String,
    default: "default",
  },
});

const emit = defineEmits(["confirm", "close"]);

const confirmAction = () => {
  emit("confirm");
};
const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <div
      class="relative z-10 w-[400px] h-[200px] bg-white rounded-lg shadow-lg flex flex-col items-center justify-between py-8"
    >
      <!-- 모달 내용 -->
      <p class="text-center text-gray-700 text-lg mt-4" v-html="message"></p>

      <div class="flex space-x-8">
        <button
          class="w-[120px] px-4 py-2 bg-[#F43630] text-white rounded-md hover:bg-[#E53030] font-bold"
          @click="confirmAction"
          v-text="buttonMessage"
        ></button>

        <!-- 취소 버튼 -->
        <button
          class="w-[120px] px-4 py-2.5 bg-white text-black border border-[#1C8A6A] rounded-md hover:bg-gray-400 font-bold text-[#1C8A6A]"
          @click="closeModal"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>
