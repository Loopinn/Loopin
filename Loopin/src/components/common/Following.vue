<script setup>
import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";
import { twMerge } from "tailwind-merge";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["text", "css", "userData"]);

const userData = ref({
  id: props.userData.id,
  followers: props.userData.followers,
  following: props.userData.following,
});

const authStore = useAuthStore();
const { loginUser, updateUser } = authStore;

const isFollowing = ref(false);
onBeforeMount(() => {
  console.log(userData.value);
  if (loginUser && loginUser.following?.includes(props.userData.id)) {
    isFollowing.value = true;
  } else {
    isFollowing.value = false;
  }
});

const toggleFollow = async (userData) => {
  if (!loginUser) {
    alert("로그인이 필요합니다.");
    return;
  }

  let updatedFollowing = loginUser.following || [];

  if (isFollowing.value) {
    updatedFollowing = updatedFollowing.filter((id) => id !== userData.id);
  } else {
    updatedFollowing.push(userData.id);
  }

  // 내 유저 팔로잉 db 업데이트
  const { data: loginUserUpdate, error: loginUserError } = await supabase
    .from("userinfo")
    .update({ following: updatedFollowing })
    .eq("id", loginUser.id)
    .select()
    .single();
  console.log("loginUserUpdate", loginUserUpdate);
  if (loginUserError) {
    console.error("팔로잉 오류", loginUserError.message);
    return;
  }

  updateUser({ following: updatedFollowing });
  console.log(loginUser);

  // 팔로잉한 유저 팔로우db 업데이트
  let updatedFollwer = userData.followers || [];

  if (isFollowing.value) {
    updatedFollwer = updatedFollwer.filter((id) => id !== loginUser.id);
  } else {
    updatedFollwer.push(loginUser.id);
  }

  const { data: followerUserUpdate, error: followerUserError } = await supabase
    .from("userinfo")
    .update({ followers: updatedFollwer })
    .eq("id", userData.id)
    .select()
    .single();

  console.log(followerUserUpdate);
  if (followerUserError) {
    console.error("상대방 팔로워 오류", followerUserError.message);
  }
  userData.followers = updatedFollwer;

  isFollowing.value = !isFollowing.value;
};
</script>
<template>
  <button
    @click="toggleFollow(props.userData)"
    :class="
      twMerge(
        `${
          isFollowing
            ? `border border-[#F43630] text-[#F43630] text-[15px]
              hover:bg-[#f43630] hover:text-white transition-all duration-200 ease-out`
            : `bg-[#F43630]  text-white border border-[#F43630]
            hover:bg-white hover:text-[#F43630] transition-all duration-200 ease-in`
        } 
        w-[65px] h-[30px] rounded-[25px]`,
        props.css,
      )
    "
  >
    {{ isFollowing ? "언팔로우" : "팔로우" }}
  </button>
</template>
<style scoped></style>
