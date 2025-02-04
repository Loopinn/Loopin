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

const emit = defineEmits(["close"]);

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

      <button
        class="w-[160px] px-4 py-3 bg-[#F43630] text-white rounded-md hover:bg-[#E53030]"
        @click="closeModal"
        v-text="buttonMessage"
      ></button>
    </div>
  </div>
</template>
