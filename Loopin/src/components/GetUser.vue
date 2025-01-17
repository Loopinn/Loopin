<script setup>
import supabase from "@/config/supabase";
import { login } from "@/utils/auth/login";
import { logout } from "@/utils/auth/logout";
import { register } from "@/utils/auth/register";
import { onMounted, ref } from "vue";

const currentUser = ref(null);

const nameInput = ref("");
const introduceInput = ref("");
const selectedFile = ref(null);

const handleLogin = async () => {
  await login(`test101@test.com`, `test101`);
  currentUser.value = (await supabase.auth.getUser()).data.user;
  console.log(currentUser.value);

  nameInput.value = currentUser.value.user_metadata.nickname;
  introduceInput.value = currentUser.value.user_metadata.introduction;
};
const handleLogout = async () => {
  await logout();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  } else {
    selectedFile.value = null;
  }
};

const handleSubmit = async () => {
  let imageUrl = null;
  if (selectedFile.value) {
    const fileName = `${Date.now()}-${selectedFile.value.name}`;
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(`images/${fileName}`, selectedFile.value);

    if (error) {
      console.error("Image upload failed:", error.message);
      return;
    }

    // 업로드된 이미지의 public URL 가져오기
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("profile-images")
      .getPublicUrl(`images/${fileName}`);
    imageUrl = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { nickname: nameInput.value, introduction: introduceInput.value, profileImage: imageUrl },
  });
  if (error) {
    console.log(error);
    return;
  }
  console.log("User updated:", data);
  currentUser.value = (await supabase.auth.getUser()).data.user;
};
</script>
<template>
  <button type="button" class="border" @click="register(`test101@test.com`, `test101`, `test101`)">register</button>
  <button type="button" class="border" @click="handleLogin">login</button>
  <button type="button" class="border" @click="handleLogout">logout</button>
  <div v-if="currentUser">
    <div>
      <img :src="currentUser.user_metadata.profileImage" alt="프로필이미지" />
    </div>
    <div>이름: {{ currentUser.user_metadata.nickname }}</div>
    <div>자기소개: {{ currentUser.user_metadata.introduction }}</div>
  </div>

  <form @submit.prevent="handleSubmit" class="border">
    <h2>수정폼</h2>
    <div>
      <label for="profileImage">프로필이미지</label>
      <input type="file" id="profileImage" class="border" @change="handleFileChange" />
    </div>
    <div>
      <label for="name">이름</label>
      <input v-model="nameInput" type="text" id="name" class="border" />
    </div>
    <div>
      <label for="introduce">자기소개</label>
      <input v-model="introduceInput" type="text" id="introduce" class="border" />
    </div>
    <button type="submit" class="border">저장</button>
  </form>
</template>
<style scoped></style>
