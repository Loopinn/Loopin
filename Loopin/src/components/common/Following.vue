<script setup>
import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";
import { twMerge } from "tailwind-merge";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["text", "css", "userId"]);

const authStore = useAuthStore();
const { loginUser, updateUser } = authStore;

const isFollowing = ref(false);
onBeforeMount(() => {
  console.log(props.userId);
  if (loginUser && loginUser.following?.includes(props.userId)) {
    isFollowing.value = true;
  } else {
    isFollowing.value = false;
  }
});

const toggleFollow = async (userId) => {
  if (!loginUser) {
    alert("로그인이 필요합니다.");
    return;
  }

  let updatedFollowing = loginUser.following || [];

  if (isFollowing.value) {
    updatedFollowing = updatedFollowing.filter((id) => id !== userId);
  } else {
    updatedFollowing.push(userId);
  }

  const { data, error } = await supabase
    .from("userinfo")
    .update({ following: updatedFollowing })
    .eq("id", loginUser.id)
    .select()
    .single();
  console.log(data);
  if (error) {
    console.error("팔로잉 오류", error.message);
    return;
  }

  // loginUser.following = updatedFollowing;
  updateUser(data);
  isFollowing.value = !isFollowing.value;
};
</script>
<template>
  <button
    @click="toggleFollow(props.userId)"
    :class="
      twMerge(
        `${
          isFollowing
            ? `border border-[#F43630] text-[#F43630] text-[15px]
              hover:bg-[#f43630] hover:text-white transition-all duration-300 ease-out`
            : `bg-[#F43630]  text-white border border-[#F43630]
            hover:bg-white hover:text-[#F43630] transition-all duration-300 ease-in`
        } 
        w-[65px] h-[30px] rounded-[25px]`,
      )
    "
  >
    {{ isFollowing ? "언팔로우" : "팔로우" }}
  </button>
</template>
<style scoped></style>
