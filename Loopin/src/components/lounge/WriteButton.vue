<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="fixed bottom-0 right-0 w-screen h-screen pointer-events-none">
    <div class="relative w-[390px] h-full mx-auto">
      <RouterLink
        to="/lounge/write"
        class="absolute bottom-[80px] right-[-90px] w-12 h-12 bg-[#f43630]
         text-white rounded-full flex items-center justify-center hover:bg-[#ff8884] transition-colors z-50 pointer-events-auto"
      >
        <div class="flex items-center justify-center w-full h-full pl-1">
          <img src="@/assets/images/pen.svg" alt="pen" class="w-6 h-6">
        </div>
      </RouterLink>
    </div>
  </div>
</template>
