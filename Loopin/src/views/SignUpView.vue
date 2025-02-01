<script setup>
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/utils/auth/register";

import InputField from "@/components/Input/InputField.vue";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

import showPassword from "@/assets/images/show-password.svg";
import { emailRegex, idRegex, passwordRegex } from "@/constants/validation";
import { useAuthStore } from "@/stores/authStore";
import { twMerge } from "tailwind-merge";
import { toast } from "vue3-toastify";

const email = ref("");
const password = ref("");
const verifyPassword = ref("");
const name = ref("");

const checkEmailError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const verifyPasswordError = ref(false);
const nameError = ref(false);

const isSubmit = ref(false);

const passwordVisible = ref(false);
const verifyPasswordVisible = ref(false);

const isModalOpen = ref(false);
const modalMessage = ref("");

const router = useRouter();

// 로그인헀으면 홈으로 리다이렉트
const authStore = useAuthStore();
onBeforeMount(() => {
  if (authStore.loginUser) {
    router.replace("/");
  }
});

// 유효성 검사 함수
const validateEmail = (email) => emailRegex.test(email);
const validatePassword = (password) => passwordRegex.test(password);
const validateName = (name) => idRegex.test(name);

const handleSubmit = async () => {
  isSubmit.value = true;

  if (!validateEmail(email.value)) {
    emailError.value = true;
    return;
  }
  if (!validatePassword(password.value)) {
    passwordError.value = true;
    return;
  }
  if (password.value !== verifyPassword.value) {
    verifyPasswordError.value = true;
    return;
  }
  if (!validateName(name.value)) {
    nameError.value = true;
    return;
  }
  if (checkEmailError.value) return;

  // 유효성 검사
  if (emailError.value || passwordError.value || verifyPasswordError.value || nameError.value) {
    return;
  }
  console.log("회원가입 진행");

  try {
    const response = await register(email.value, password.value, name.value);

    if (response.error) {
      checkEmailError.value = true;
      toast.error(`회원가입 실패: ${response.error.message}`);
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
    toast("회원가입 중 오류 발생");
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

// 회원가입 버튼 disbaled 함수
const disableBtn = (name, email, password, verifyPassword) => {
  return (
    name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0 && verifyPassword.trim().length > 0
  );
};

// 모달 닫기
const toggleModal = () => {
  isModalOpen.value = false;
  router.push("/signIn");
};

watchEffect(() => {
  if (isSubmit.value) {
    const isEmailValid = validateEmail(email.value);
    emailError.value = !isEmailValid;

    const isPasswordValid = validatePassword(password.value);
    passwordError.value = !isPasswordValid;

    verifyPasswordError.value = password.value !== verifyPassword.value;

    const isNameValid = validateName(name.value);
    nameError.value = !isNameValid;
  }
});

watch(
  () => email.value,
  () => {
    checkEmailError.value = false;
  },
);
</script>
<template>
  <div class="flex flex-col w-full min-h-[calc(100vh-144px)] items-center align-center">
    <h1 class="my-[72px] font-bold text-[36px]">회원가입</h1>
    <form class="flex-grow flex flex-col w-[400px] space-y-6 mb-[80px]" @submit.prevent="handleSubmit">
      <div>
        <InputField
          label="이메일"
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요"
          v-model="email"
          :error="emailError || checkEmailError"
        />
        <p v-if="emailError || checkEmailError" class="text-red-500 text-[13px] mt-1 ml-2">
          {{
            emailError ? "올바른 이메일 형식을 입력해주세요!" : checkEmailError ? "이메일이 이미 사용중 입니다!" : null
          }}
        </p>
      </div>
      <div>
        <div class="relative w-full">
          <InputField
            label="비밀번호"
            id="password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="비밀번호를 입력해 주세요."
            v-model="password"
            :error="passwordError"
          />
          <button
            type="button"
            @click="togglePasswordVisible"
            class="absolute right-4 bottom-0 transform -translate-y-1/2"
          >
            <img :src="showPassword" alt="Show password " />
          </button>
        </div>
        <p v-if="passwordError" class="text-red-500 text-[12px] mt-1 ml-2">
          비밀번호는 8~16자의 길이이며, 소문자, 대문자, 숫자, 특수문자를 모두 포함해야 합니다.
        </p>
      </div>
      <div>
        <div class="relative w-full">
          <InputField
            label="비밀번호 확인"
            id="verify-password"
            :type="verifyPasswordVisible ? 'text' : 'password'"
            placeholder="비밀번호를 입력해 주세요."
            v-model="verifyPassword"
            :error="verifyPasswordError"
          />
          <button
            type="button"
            @click="toggleVerifyPasswordVisible"
            class="absolute right-4 bottom-0 transform -translate-y-1/2"
          >
            <img :src="showPassword" alt="Show password " />
          </button>
        </div>
        <p v-if="verifyPasswordError" class="text-red-500 text-[12px] mt-1 ml-2">비밀번호가 일치하지 않습니다!</p>
      </div>
      <div>
        <InputField label="이름" id="name" placeholder="이름을 입력하세요" v-model="name" :error="nameError" />
        <p v-if="nameError" class="text-red-500 text-[12px] mt-1 ml-2">
          이름은 4~12자의 영문 대소문자와 숫자로 구성되어야 합니다.
        </p>
      </div>
      <button
        type="submit"
        :disabled="!disableBtn(name, email, password, verifyPassword)"
        :class="
          twMerge(
            `w-full h-[48px] disabled:bg-[#d9d9d9] disabled:text-[#999696] rounded-[20px] flex items-center justify-center text-lg
            bg-[#f43630] text-white
            `,
          )
        "
      >
        회원가입
      </button>
    </form>
    <ConfirmModal :isOpen="isModalOpen" :message="modalMessage" :buttonMessage="'확인'" @close="toggleModal">
    </ConfirmModal>
  </div>
</template>
