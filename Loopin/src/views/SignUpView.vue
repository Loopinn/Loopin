<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/utils/auth/register";

import InputField from "@/components/Input/InputField.vue";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

import showPassword from "@/assets/images/show-password.svg";

const email = ref("");
const password = ref("");
const verifyPassword = ref("");
const name = ref("");

const passwordVisible = ref(false);
const verifyPasswordVisible = ref(false);

const isModalOpen = ref(false);
const modalMessage = ref("");

const router = useRouter();

// 유효성 검사
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
const idRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,12}$/;

// 유효성 검사 함수
const validateEmail = (email) => emailRegex.test(email);
const validatePassword = (password) => passwordRegex.test(password);
const validateName = (name) => idRegex.test(name);

const handleSubmit = async (e) => {
  e.preventDefault();

  // 유효성 검사
  if (!validateEmail(email.value)) {
    alert("올바른 이메일 형식이 아닙니다.");
    return;
  }
  if (!validatePassword(password.value)) {
    alert("비밀번호는 8~16자의 길이이며, 소문자, 대문자, 숫자, 특수문자를 모두 포함해야 합니다.");
    return;
  }
  if (!validateName(name.value)) {
    alert("이름은 4~12자의 영문 대소문자와 숫자로 구성되어야 합니다.");
    return;
  }

  if (password.value !== verifyPassword.value) {
    alert("비밀번호와 비밀번호 확인이 일치하지 않아요.");
    return;
  }

  try {
    const response = await register(email.value, password.value, name.value);

    if (response.error) {
      alert(`회원가입 실패: ${response.error.message}`);
    } else {
      modalMessage.value = "<b style='font-size: 22px; color: #000;'>회원가입이 완료되었습니다</b>";
      isModalOpen.value = true;
      console.log({
        email: email.value,
        password: password.value,
        verifyPassword: verifyPassword.value,
        name: name.value,
      });
    }
  } catch (error) {
    console.log("회원가입 중 오류 발생", error.message);
    alert("회원가입 중 오류 발생");
  }
};

const togglePasswordVisible = (e) => {
  e.preventDefault();
  passwordVisible.value = !passwordVisible.value;
};

const toggleVerifyPasswordVisible = (e) => {
  e.preventDefault();
  verifyPasswordVisible.value = !verifyPasswordVisible.value;
};

// 모달 닫기
const toggleModal = () => {
  isModalOpen.value = false;
  router.push("/signIn");
};
</script>
<template>
  <div class="flex flex-col w-full min-h-[calc(100vh-144px)] items-center align-center">
    <h1 class="my-[72px] font-bold text-[36px]">회원가입</h1>
    <form class="flex-grow flex flex-col w-[400px] space-y-6 mb-[80px]" @submit="handleSubmit">
      <InputField label="이메일" id="email" type="email" placeholder="이메일을 입력해 주세요" v-model="email" />
      <div class="relative w-full">
        <InputField
          label="비밀번호"
          id="password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="비밀번호를 입력해 주세요."
          v-model="password"
        />
        <button @click="togglePasswordVisible" class="absolute right-4 bottom-0 transform -translate-y-1/2">
          <img :src="showPassword" alt="Show password " />
        </button>
      </div>
      <div class="relative w-full">
        <InputField
          label="비밀번호 확인"
          id="verify-password"
          :type="verifyPasswordVisible ? 'text' : 'password'"
          placeholder="비밀번호를 입력해 주세요."
          v-model="verifyPassword"
        />
        <button @click="toggleVerifyPasswordVisible" class="absolute right-4 bottom-0 transform -translate-y-1/2">
          <img :src="showPassword" alt="Show password " />
        </button>
      </div>
      <InputField label="이름" id="name" placeholder="이름을 입력하세요" v-model="name" />
      <button
        type="submit"
        class="w-full h-[48px] bg-[#d9d9d9] rounded-[20px] flex items-center justify-center text-[#999696] text-lg"
      >
        회원가입
      </button>
    </form>
    <ConfirmModal :isOpen="isModalOpen" :message="modalMessage" :buttonMessage="'확인'" @close="toggleModal">
    </ConfirmModal>
  </div>
</template>
