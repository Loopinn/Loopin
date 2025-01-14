<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <nav class="flex gap-3">
    <RouterLink to="/">메인</RouterLink>
    <RouterLink to="/socialing">소셜링</RouterLink>
    <RouterLink to="/club">클럽</RouterLink>
    <RouterLink to="/challenge">챌린지</RouterLink>
    <RouterLink to="/lounge">라운지</RouterLink>
    <RouterLink to="/signIn">로그인</RouterLink>
    <RouterLink to="/signUp">회원가입</RouterLink>
    <RouterLink to="/user">프로필</RouterLink>
  </nav>
  <RouterView />
</template>
<style scoped></style>
