<!-- 임시 컴포넌트 입니다 나중에 삭제 예정 -->

<script setup>
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { login } from "@/utils/auth/login";
import { onBeforeMount, ref } from "vue";

const postStore = usePostStore();
const { createLoungePost, loadLoungePosts, deleteLoungePost } = postStore;

const title = ref("");
const description = ref("");
const creator = ref("91021736-14c0-4b73-a92f-89429ca7a65d");
const images = ref(null);

const uemail = ref("");
const upassword = ref("");

onBeforeMount(() => {
  loadLoungePosts();
  // console.log("loungePosts", loungePosts);
});

const handleImages = (e) => {
  const files = e.target.files;
  console.log(files);
  if (files) {
    images.value = Array.from(files);
    console.log(images.value);
  } else {
    images.value = null;
  }
};

const handleSubmit = async () => {
  if (!images.value) {
    return alert("이미지를 선택해야합니다.");
  }

  if (title.value && description.value && creator.value) {
    const imageUrls = await Promise.all(
      images.value.map(async (image) => {
        const fileName = `${Date.now()}-${image.name}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from("post-images")
          .upload(`images/feed/${fileName}`, image);

        if (imageError) throw imageError;
        console.log("imageData", imageData);
        const { data: imagePath } = supabase.storage.from("post-images").getPublicUrl(`images/feed/${fileName}`);

        const imageUrl = imagePath.publicUrl;
        return imageUrl;
      }),
    );

    const submitResponse = await createLoungePost(
      {
        title: title.value,
        description: description.value,
        creator: creator.value,
        images: imageUrls,
      },
      "91021736-14c0-4b73-a92f-89429ca7a65d",
    );
    console.log("done", submitResponse);
  } else {
    return alert("빈칸을 채워주세");
  }
};
</script>
<template>
  <h1>lounge post</h1>
  <!-- 임시 로그인 -->
  <form @submit.prevent="login(uemail, upassword)">
    <input type="email" v-model="uemail" placeholder="이메일" />
    <input type="password" v-model="upassword" placeholder="비밀번호" />
    <button>submut</button>
  </form>

  <form @submit.prevent="handleSubmit">
    <div class="flex items-center space-x-2">
      <label for="title" class="text-sm w-24">제목</label>
      <input type="text" id="title" v-model="title" class="border p-2 rounded flex-1" />
    </div>
    <div class="flex items-center space-x-2">
      <label for="description" class="text-sm w-24">내용</label>
      <textarea type="text" id="description" v-model="description" class="border p-2 rounded flex-1" />
    </div>
    <div class="flex items-center space-x-2">
      <label for="file" class="text-sm w-24">file</label>
      <input type="file" id="file" accept="image/*" @change="handleImages" class="border p-2 rounded flex-1" multiple />
    </div>
    <button type="submit" class="bg-blue-500 text-white p-2 rounded">등록</button>
  </form>
  <!-- <button @click="deleteLoungePost('20d73a6d-16da-4aa0-ba22-9995807269a6')">delete</button> -->
</template>
<style scoped></style>
