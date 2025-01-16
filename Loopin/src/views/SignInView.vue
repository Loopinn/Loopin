<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import InputField from "@/components/Input/InputField.vue";

import kakaoIcon from "@/assets/images/kakaoIcon.svg";
import kakaoLogin from "@/assets/images/kakaoLogin.svg";

const email = ref("");
const password = ref("");

const router = useRouter();

const handleSubmit = (e) => {
  e.preventDefault();
  console.log({
    email: email.value,
    password: password.value,
  });
};

const navigateToSignUp = () => {
  router.push("/signUp");
};
</script>
<template>
  <div class="flex flex-col w-full min-h-[calc(100vh-144px)] items-center align-center">
    <h1 class="my-[72px] font-bold text-[36px]">로그인</h1>
    <div class="flex-grow flex flex-col w-[400px] mb-[80px]">
      <form @submit="handleSubmit" class="space-y-6">
        <InputField label="이메일" id="email" type="email" placeholder="이메일을 입력해 주세요" v-model="email" />
        <InputField
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          v-model="password"
        />
        <button
          type="submit"
          class="w-full h-[48px] bg-[#d9d9d9] rounded-[20px] flex items-center justify-center text-[#999996] text-lg mt-4"
        >
          로그인
        </button>
      </form>
      <div class="flex w-[400px] justify-between my-6">
        <button class="text-[#999996] text-sm underline">계정정보를 잊으셨나요?</button>
        <button class="text-[#999996] text-sm" @click="navigateToSignUp">회원가입하기</button>
      </div>
      <button class="flex justify-center">
        <div class="flex w-[400px] h-[48px] items-center justify-center rounded-[20px] bg-[#FAE100] gap-x-1">
          <img :src="kakaoIcon" alt="카카오" />
          <img :src="kakaoLogin" alt="카카오로 로그인" />
        </div>
      </button>
    </div>
  </div>
</template>
<style scoped></style>
