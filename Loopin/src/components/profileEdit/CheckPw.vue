<script setup>
import { login } from "@/utils/auth/login";
import { ref } from "vue";

const upw = ref("");

const props = defineProps(["uemail", "checkPW"]);

const emit = defineEmits(["update:checkPW"]);

console.log(props.uemail);
const handleSubmit = async () => {
  if (upw.value.trim().length === 0) return alert("비밀번호를 입력하세요");
  try {
    const { data, error } = await login(props.uemail, upw.value);
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
};
</script>
<template>
  <div class="border bg-[#dddddd] flex flex-col justify-center items-center" style="height: calc(100vh - 192px)">
    <form class="flex flex-col items-center gap-2" @submit.prevent="handleSubmit">
      <label for="pw" class="text-[24px]">현재 비밀번호를 입력해주세요</label>
      <div>
        <input
          id="pw"
          v-model="upw"
          type="password"
          required
          :class="`px-3 outline-none border border-[#d9d9d9] w-[170px] h-[45px] rounded-[10px]`"
        />
        <button class="w-[70px] h-[45px] bg-[#cc2a24] text-white rounded-[10px] ml-3">확인</button>
      </div>
    </form>
  </div>
</template>
<style scoped></style>
