<script setup>
import { defineProps } from "vue";

const props = defineProps({
  isModalOpen: {
    type: Boolean,
  },
});
const emit = defineEmits(["close", "confirm"]);

function closeModal() {
  emit("close");
}

function confirmDelete() {
  emit("confirm");
  closeModal();
}
</script>

<template>
  <div>
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white border rounded-lg w-[400px] p-4">
        <h2 class="text-lg font-bold">삭제 확인</h2>
        <p>정말로 삭제하시겠습니까?</p>
        <div class="flex justify-end mt-4">
          <button @click="closeModal" class="mr-2 text-gray-500">취소</button>
          <button @click="confirmDelete" class="text-red-500">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>