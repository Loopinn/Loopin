<script>
export default {
  name: "CenteredHeader",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<template>
  <div class="h-[80px] bg-[#d9d9d9]">
    <header class="flex relative justify-center items-center w-full h-full py-4">
      <button @click="goBack" class="absolute top-1/2 -translate-y-1/2 left-9 cursor-pointer">
        <img src="@/assets/images/arrow-left.svg" alt="Back" class="w-[18px] h-[18px]" />
      </button>
      <h1 class="text-3xl text-center">Loopin</h1>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
