<script setup>
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const postStore = usePostStore();
const { challengePosts } = storeToRefs(postStore);
const { loadChallengePosts, createChallengePost, deleteChallengePost, updateChallengePost } = postStore;

const fee = ref("");
const feeInfo = ref("");
const category = ref("");
const postTitle = ref("");
const postDes = ref("");
const startDate = ref(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }).split("T")[0]);
const endDate = ref(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }).split("T")[0]);
const tpw = ref("");
const max = ref("");

const convertTime = (time) => {
  const date = new Date(time);
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(date.getTime() + kstOffset);

  return kstTime.toISOString().replace("T", " ").slice(0, 19);
};

const handleChallengeSubmit = () => {
  if (fee && category && postTitle && startDate && endDate && tpw && max) {
    createChallengePost({
      fee: fee.value,
      fee_info: feeInfo.value,
      category: category.value,
      title: postTitle.value,
      description: postDes.value,
      start_date: startDate.value,
      end_date: endDate.value,
      times_per_week: tpw.value,
      max_people: max.value,
    });
  }
};
const handleUpdate = (postId) => {
  //바꾸고싶은 값 입력
  updateChallengePost(postId, {
    title: "updated3",
  });
};

onMounted(() => {
  loadChallengePosts();
});
</script>
<template>
  <h1>createChallengeForm</h1>
  <form @submit.prevent="handleChallengeSubmit" class="max-w-lg mx-auto space-y-4">
    <div class="flex items-center space-x-2">
      <label for="fee" class="text-sm w-24">참가비</label>
      <input type="text" id="fee" v-model="fee" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="feeinfo" class="text-sm w-24">참가비내용(참가비 있을 경우)</label>
      <input type="text" id="feeinfo" v-model="feeInfo" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="category" class="text-sm w-24">주제</label>
      <input type="text" id="category" v-model="category" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="title" class="text-sm w-24">소개글 제목</label>
      <input type="text" id="title" v-model="postTitle" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="description" class="text-sm w-24">소개글 내용(선택)</label>
      <input type="text" id="description" v-model="postDes" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="start-date" class="text-sm w-24">시작 날짜</label>
      <input type="date" id="start-date" v-model="startDate" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="end-date" class="text-sm w-24">종료 날짜</label>
      <input type="date" id="end-date" v-model="endDate" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="tpw" class="text-sm w-24">주 몇 회</label>
      <input type="text" id="tpw" v-model="tpw" class="border p-2 rounded flex-1" />
    </div>

    <div class="flex items-center space-x-2">
      <label for="max" class="text-sm w-24">최대 인원</label>
      <input type="text" id="max" v-model="max" class="border p-2 rounded flex-1" />
    </div>

    <button type="submit" class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">create</button>
  </form>
  <div>challengePosts</div>
  <div v-for="post in challengePosts" class="border" :key="post.id">
    <button @click="handleUpdate(post.id)">update</button>
    <h2>id: {{ post.id }}</h2>
    <p>title: {{ post.title }}</p>
    <p>created-at: {{ convertTime(post.created_at) }}</p>
    <p>updated-at: {{ convertTime(post.updated_at) }}</p>
    <p>fee: {{ post.fee }}</p>
    <p>fee-info: {{ post.fee_info }}</p>
    <p>description: {{ post.description }}</p>
    <p>images: {{ post.images }}</p>
    <p>start-date: {{ post.start_date }}</p>
    <p>end-date: {{ post.end_date }}</p>
    <p>times-per-week: {{ post.times_per_week }}</p>
    <p>likes: {{ post.likes }}</p>
    <p>creator: {{ post.creator }}</p>
    <p>participants: {{ post.participants }}</p>
    <p>max-people: {{ post.max_people }}</p>
    <button type="button" class="border" @click="deleteChallengePost(post.id)">delete</button>
  </div>
</template>
<style scoped></style>
