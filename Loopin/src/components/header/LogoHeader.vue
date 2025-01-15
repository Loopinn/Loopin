<script>
export default {
  name: "LogoHeader",
};
</script>

<template>
  <div class="h-[80px] bg-[#d9d9d9]">
    <header class="flex items-center w-full h-full ml-10">
      <h1 class="text-3xl">Loopin</h1>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
