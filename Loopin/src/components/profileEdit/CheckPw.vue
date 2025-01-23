<script setup>
import { login } from "@/utils/auth/login";
import { ref } from "vue";

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
      alert("이메일이 일치하지 않습니다!");
    }
  } else {
    if (ucheck.value.trim().length === 0) return alert("비밀번호를 입력하세요");
    try {
      const { data, error } = await login(props.uemail, ucheck.value);
      if (!error && data) {
        alert("인증되었습니다");
        emit("update:checkPW", true);
      } else {
        alert("비밀번호가 일치하지 않습니다!");
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
  <div class="bg-[#f3f3f3] flex flex-col justify-center items-center" style="height: calc(100vh - 192px)">
    <form class="flex flex-col items-center gap-2" @submit.prevent="handleSubmit">
      <label v-if="!isKakao" for="pw" class="text-[22px]">현재 비밀번호를 입력해주세요</label>
      <label v-else for="pw" class="text-[22px]">카카오 이메일을 입력해주세요</label>
      <div>
        <input
          id="pw"
          v-model="ucheck"
          :type="isKakao ? 'email' : 'password'"
          required
          :class="`px-3 outline-none border border-[#d9d9d9] ${isKakao ? 'w-[220px]' : 'w-[170px]'} h-[50px] rounded-[10px]`"
        />
        <button class="w-[70px] h-[50px] bg-[#cc2a24] text-white rounded-[10px] ml-3">확인</button>
      </div>
    </form>
  </div>
</template>
<style scoped></style>
