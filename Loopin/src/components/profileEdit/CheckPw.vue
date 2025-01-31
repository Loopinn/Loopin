<script setup>
import { login } from "@/utils/auth/login";
import { ref } from "vue";
import { toast } from "vue3-toastify";

const ucheck = ref(""); // 카카오면 이메일, 아니면 비밀번호

const props = defineProps(["uemail", "checkPW", "isKakao"]);

const emit = defineEmits(["update:checkPW"]);

console.log(props.uemail);
const handleSubmit = async () => {
  if (props.isKakao) {
    if (ucheck.value.trim().length === 0) return alert("카카오 이메일을 다시 확인해주세요");

    if (ucheck.value.trim() === props.uemail) {
      emit("update:checkPW", true);
    } else {
      toast.error("이메일이 일치하지 않습니다!");
    }
  } else {
    if (ucheck.value.trim().length === 0) return alert("비밀번호를 입력하세요");
    try {
      const { data, error } = await login(props.uemail, ucheck.value);
      if (!error && data) {
        toast("인증되었습니다");
        emit("update:checkPW", true);
      } else {
        toast.error("비밀번호가 일치하지 않습니다!");
        throw new Error("비밀번호 에러" + error);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
<template>
  <div class="bg-[#f7f7f7] flex flex-col justify-center items-center relative" style="height: calc(100vh - 145px)">
    <div class="px-8 py-6 w-full bg-gradient-to-r from-[#F43630] to-[#FF6B66] absolute top-0">
      <h1 class="text-2xl font-bold text-white">보안 확인</h1>
      <p class="text-red-100 mt-1">
        {{ props.isKakao ? "개인정보 보호를 위해 이메일을 확인합니다" : "개인정보 보호를 위해 비밀번호를 확인합니다" }}
      </p>
    </div>
    <form class="flex flex-col" @submit.prevent="handleSubmit">
      <label v-if="!isKakao" for="pw" class="text-[16px] text-gray-700">현재 비밀번호</label>
      <label v-else for="pw" class="text-[16px]">카카오 이메일을 입력해주세요</label>
      <div>
        <input
          id="pw"
          v-model="ucheck"
          :type="isKakao ? 'email' : 'password'"
          required
          :class="`px-3 outline-none border border-[#d9d9d9] w-[250px] h-[45px] rounded-[10px] placeholder:text-[14px]`"
          :placeholder="isKakao ? '카카오 이메일을 입력해주세요' : '현재 비밀번호를 입력해주세요'"
        />
        <button class="w-[70px] h-[45px] bg-[#F43630] text-white rounded-[10px] ml-3">확인</button>
      </div>
    </form>
  </div>
</template>
<style scoped></style>
