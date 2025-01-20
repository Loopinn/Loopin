<script setup>
import supabase from "@/config/supabase";
import { login } from "@/utils/auth/login";
import { logout } from "@/utils/auth/logout";
import { register } from "@/utils/auth/register";
import PostCreateView from "@/views/PostCreateView.vue";
import { onMounted, ref } from "vue";

const currentUser = ref(null);
const allUsers = ref([]);

const nameInput = ref("");
const introduceInput = ref("");
const selectedFile = ref(null);

const oldps = ref("");
const newps = ref("");
const newpscheck = ref("");

const fetchAllUsers = async () => {
  const { data: users, error } = await supabase.from("userinfo").select("*");
  if (error) {
    console.error("Failed to fetch users:", error.message);
    return;
  }
  allUsers.value = users;
};

const handleLogin = async () => {
  await login(`test12@test.com`, `test12`);

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  // userinfo 데이터 조회
  const { data: userInfo, error: userInfoError } = await supabase
    .from("userinfo")
    .select("*")
    .eq("id", userId)
    .single();

  if (userInfoError) throw userInfoError;

  console.log("User profile:", userInfo);

  currentUser.value = userInfo;

  nameInput.value = currentUser.value.nickname;
  introduceInput.value = currentUser.value.description;

  // Refresh all users after login
  await fetchAllUsers();
};
const handleLogout = async () => {
  await logout();

  currentUser.value = null;
  await fetchAllUsers();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  } else {
    selectedFile.value = null;
  }
};

const handleUpdateSubmit = async () => {
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

  // profile_img가 null인 경우 업데이트 요청에서 제외
  const updateData = {
    nickname: nameInput.value,
    description: introduceInput.value,
  };

  if (imageUrl !== null) {
    updateData.profile_img = imageUrl; // 이미지 URL이 존재하면 profile_img 포함
  }

  const { data, error } = await supabase.auth.updateUser({
    data: updateData,
  });
  if (error) {
    console.log(error);
    return;
  }
  console.log("User updated:", data);
};

const passwordUpdate = async () => {
  //기존 비밀번호를 입력받아서 로그인 시도
  const response = await login(currentUser.value.email, oldps.value);
  //만약 로그인이 잘 되었다면 비밀번호 변경
  if (!response.error) {
    // 비밀번호 업데이트
    if (newps.value === newpscheck.value) {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newps.value,
      });
      if (updateError) {
        alert(`비밀번호 변경 실패: ${updateError.message}`);
        return;
      }
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } else {
      window.alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
  } else {
    window.alert("현재 비밀번호가 일치하지 않습니다.");
    return;
  }
};

const subscribeToUserInfo = () => {
  // 구독 채널을 설정합니다.
  const subscription = supabase
    .channel("userinfo")
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "userinfo" }, (payload) => {
      console.log("User info updated:", payload);

      // 업데이트된 user 정보가 현재 로그인한 사용자와 일치하는지 확인
      if (currentUser.value && currentUser.value.id === payload.new.id) {
        currentUser.value = {
          ...currentUser.value,
          nickname: payload.new.nickname,
          description: payload.new.description,
          profile_img: payload.new.profile_img,
        };
      }
    })
    .subscribe();

  return subscription;
};

const toggleFollow = async (userId) => {
  if (!currentUser.value) {
    alert("로그인이 필요합니다.");
    return;
  }

  const isFollowing = currentUser.value.following?.includes(userId);
  let updatedFollowing = currentUser.value.following || [];

  if (isFollowing) {
    updatedFollowing = updatedFollowing.filter((id) => id !== userId);
  } else {
    updatedFollowing.push(userId);
  }

  const { error } = await supabase
    .from("userinfo")
    .update({ following: updatedFollowing })
    .eq("id", currentUser.value.id);
  if (error) {
    console.error("Failed to update following list:", error.message);
    return;
  }

  currentUser.value.following = updatedFollowing;
};

onMounted(async () => {
  subscribeToUserInfo();
  await fetchAllUsers();
});
</script>
<template>
  <button type="button" class="border" @click="register(`test12@test.com`, `test12`, `test12`)">register</button>
  <button type="button" class="border" @click="handleLogin">login</button>
  <button type="button" class="border" @click="handleLogout">logout</button>
  <div v-if="currentUser">
    <div>
      <img :src="currentUser.profile_img" alt="프로필이미지" />
    </div>
    <div>이름: {{ currentUser.nickname }}</div>
    <div class="break-all">자기소개: {{ currentUser.description }}</div>
  </div>

  <form @submit.prevent="handleUpdateSubmit" class="border">
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
  <form @submit.prevent="passwordUpdate">
    <p>비밀번호 변경</p>
    <div>
      <label for="oldps">현재 비밀번호</label>
      <input v-model="oldps" type="password" id="oldps" class="border" />
    </div>
    <div>
      <label for="newps">새 비밀번호</label>
      <input v-model="newps" type="password" id="newps" class="border" />
    </div>
    <div>
      <label for="newpscheck">새 비밀번호 확인</label>
      <input v-model="newpscheck" type="password" id="newpscheck" class="border" />
    </div>
    <button class="border">변경</button>
  </form>

  <div>
    <h2>전체 유저 목록</h2>
    <ul>
      <li
        v-for="user in allUsers.filter((user) => !currentUser || user.id !== currentUser.id)"
        :key="user.id"
        class="border border-black"
      >
        <div>
          <img :src="user.profile_img" alt="프로필이미지-all" />
        </div>
        <div>이름: {{ user.nickname }}</div>
        <div class="break-all">자기소개: {{ user.description }}</div>
        <button @click="toggleFollow(user.id)" class="border">
          {{ currentUser?.following?.includes(user.id) ? "팔로잉" : "팔로우" }}
        </button>
      </li>
    </ul>
  </div>

  <PostCreateView />
</template>
<style scoped></style>
