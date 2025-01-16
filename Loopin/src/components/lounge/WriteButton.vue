<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="fixed bottom-0 right-0 w-screen h-screen pointer-events-none">
    <div class="relative w-[390px] h-full mx-auto">
      <RouterLink
        to="/lounge/write"
        class="absolute bottom-[80px] right-[-90px] w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-50 pointer-events-auto"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
