<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (e) => {
  emit("update:modelValue", e.target.value);
};
</script>

<template>
  <div class="flex flex-col w-full">
    <label :for="id" class="text-[14px] ml-2 mb-1">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      class="h-[48px] border border-gray-300 rounded-[10px] pl-4 placeholder:text-sm"
    />
  </div>
</template>
