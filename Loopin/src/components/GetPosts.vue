<script setup>
import supabase from "@/config/supabase";
import { useCommentStore } from "@/stores/commetStore";
import { usePostStore } from "@/stores/postStore";
import { login } from "@/utils/auth/login";
import { logout } from "@/utils/auth/logout";
import { register } from "@/utils/auth/register";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import GetComments from "./GetComments.vue";

const postStore = usePostStore();
const { challengePosts } = storeToRefs(postStore);
const { loadChallengePosts, createChallengePost, deleteChallengePost, updateChallengePost } = postStore;

const commentStore = useCommentStore();
const { challengeComments } = storeToRefs(commentStore);
const { loadChallengeComments } = commentStore;

const fee = ref("");
const feeInfo = ref("");
const category = ref("");
const postTitle = ref("");
const postDes = ref("");
const startDate = ref(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }).split("T")[0]);
const endDate = ref(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }).split("T")[0]);
const tpw = ref("");
const max = ref("");
const selectedFile = ref(null);

const handleLogin = async () => {
  await login(`test666@test.com`, `test666`);
};
const handleLogout = async () => {
  await logout();
};

const convertTime = (time) => {
  const date = new Date(time);
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(date.getTime() + kstOffset);

  return kstTime.toISOString().replace("T", " ").slice(0, 19);
};

const handleChallengeSubmit = async () => {
  if (!selectedFile.value) {
    alert("Please select a file first.");
    return;
  }

  let imageUrl = null;
  if (selectedFile.value) {
    const fileName = `${Date.now()}-${selectedFile.value.name}`;
    const { data, error } = await supabase.storage.from("post-images").upload(`images/${fileName}`, selectedFile.value);

    if (error) {
      console.error("Image upload failed:", error.message);
      return;
    }

    // 업로드된 이미지의 public URL 가져오기
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("post-images")
      .getPublicUrl(`images/${fileName}`);
    imageUrl = publicUrlData.publicUrl;
  }

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
      images: imageUrl,
    });
  }
};

const handleUpdate = (postId) => {
  //바꾸고싶은 값 입력
  updateChallengePost(postId, {
    title: "updated3",
  });
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  } else {
    selectedFile.value = null;
  }
};

const filePreviewUrl = computed(() => {
  return selectedFile.value ? URL.createObjectURL(selectedFile.value) : null;
});

onMounted(() => {
  loadChallengePosts();
});
</script>
<template>
  <button type="button" @click="register(`test666@test.com`, `test666`, `test666`)">register</button>
  <button type="button" @click="handleLogin">login</button>
  <button type="button" @click="handleLogout">logout</button>
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
      <label for="image" class="text-sm w-24">이미지</label>
      <input type="file" id="image" @change="handleFileChange" class="border p-2 rounded flex-1" />
    </div>
    <div v-if="filePreviewUrl" class="mt-4">
      <p>이미지 미리보기:</p>
      <img :src="filePreviewUrl" alt="Preview" class="w-32 h-32 object-cover" />
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
    <img :src="post.images" alt="" />
    <p>start-date: {{ post.start_date }}</p>
    <p>end-date: {{ post.end_date }}</p>
    <p>times-per-week: {{ post.times_per_week }}</p>
    <p>likes: {{ post.likes }}</p>
    <p>creator: {{ post.creator }}</p>
    <p>participants: {{ post.participants }}</p>
    <p>max-people: {{ post.max_people }}</p>
    <button type="button" class="border" @click="deleteChallengePost(post.id)">delete</button>
    <div>
      <GetComments :post-id="post.id" />
    </div>
  </div>
  <div class="h-[64px]"></div>
</template>
<style scoped></style>
