<script setup>
import { defineProps, defineEmits, computed } from "vue";

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
  pageType: {
    type: String,
  },
});

const emit = defineEmits(["confirm", "close"]);

const confirmAction = () => {
  emit("confirm");
};
const closeModal = () => {
  emit("close");
};

console.log(props.pageType);

const bgColor = computed(() => {
  switch (props.pageType) {
    case "challenge":
      return "bg-[#3498D0] hover:bg-[#3B8FB3]";
    case "club":
      return "bg-[#1C8A6A] hover:bg-[#176E55]";
    case "socialing":
    default:
      return "bg-[#F43630] hover:bg-[#CC0000]";
  }
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

    <div
      class="relative z-10 w-[400px] min-h-[200px] bg-white rounded-lg shadow-lg flex flex-col items-center justify-between py-8 px-[15px]"
    >
      <!-- 모달 내용 -->
      <p class="text-center text-gray-700 text-lg mt-4" v-html="message"></p>

      <div class="flex space-x-8">
        <button
          class="w-[120px] px-4 py-2 text-white rounded-md"
          :class="bgColor"
          @click="confirmAction"
          v-text="buttonMessage"
        ></button>

        <!-- 취소 버튼 -->
        <button
          class="w-[120px] px-4 py-2.5 bg-white text-black border border-[#ababab] rounded-md hover:bg-gray-400"
          @click="closeModal"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>
