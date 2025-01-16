<script setup>
import { ref } from "vue";
import InputField from "@/components/Input/InputField.vue";

const email = ref("");
const password = ref("");
const verifyPassword = ref("");
const name = ref("");

const handleSubmit = (e) => {
  e.preventDefault();
  console.log({
    email: email.value,
    password: password.value,
    verifyPassword: verifyPassword.value,
    name: name.value,
  });
};
</script>
<template>
  <div class="flex flex-col w-full min-h-[calc(100vh-144px)] items-center align-center">
    <h1 class="my-[72px] font-bold text-[36px]">회원가입</h1>
    <form class="flex-grow flex flex-col w-[400px] space-y-6 mb-[80px]" @submit="handleSubmit">
      <InputField label="이메일" id="email" type="email" placeholder="이메일을 입력해 주세요" v-model="email" />
      <InputField
        label="비밀번호"
        id="password"
        type="password"
        placeholder="비밀번호를 입력해 주세요."
        v-model="password"
      />
      <InputField
        label="비밀번호 확인"
        id="verify-password"
        type="password"
        placeholder="비밀번호를 입력해 주세요."
        v-model="verifyPassword"
      />
      <InputField label="이름" id="name" placeholder="이름을 입력하세요" v-model="name" />
      <button
        type="submit"
        class="w-full h-[48px] bg-[#d9d9d9] rounded-[20px] flex items-center justify-center text-[#999696] text-lg"
      >
        회원가입
      </button>
    </form>
  </div>
</template>
