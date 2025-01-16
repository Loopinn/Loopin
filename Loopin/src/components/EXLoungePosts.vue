<!-- 임시 컴포넌트 입니다 나중에 삭제 예정 -->

<script setup>
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const postStore = usePostStore();
const { loungePosts } = storeToRefs(postStore);
const { createLoungePost, loadLoungePosts, deleteLoungePost } = postStore;

const title = ref("");
const description = ref("");
const creator = ref("91021736-14c0-4b73-a92f-89429ca7a65d");

onBeforeMount(() => {
  loadLoungePosts();
  // console.log("loungePosts", loungePosts);
});
</script>
<template>
  <h1>lounge post</h1>
  <form @submit.prevent="createLoungePost({ title, description, creator }, '91021736-14c0-4b73-a92f-89429ca7a65d')">
    <div class="flex items-center space-x-2">
      <label for="title" class="text-sm w-24">제목</label>
      <input type="text" id="title" v-model="title" class="border p-2 rounded flex-1" />
    </div>
    <div class="flex items-center space-x-2">
      <label for="description" class="text-sm w-24">내용</label>
      <textarea type="text" id="description" v-model="description" class="border p-2 rounded flex-1" />
    </div>
    <button type="submit" class="bg-blue-500 text-white p-2 rounded">등록</button>
  </form>
  <!-- <button @click="deleteLoungePost('20d73a6d-16da-4aa0-ba22-9995807269a6')">delete</button> -->

  <div>
    <pre>{{ loungePosts }}</pre>
  </div>
</template>
<style scoped></style>
