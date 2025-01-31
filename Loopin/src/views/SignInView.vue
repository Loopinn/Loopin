<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/utils/auth/login";
import { kakaoLogin } from "@/utils/auth/kakaoLogin";

import InputField from "@/components/Input/InputField.vue";
import Loading from "@/components/Loading.vue";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";

import showPassword from "@/assets/images/show-password.svg";
import kakaoIcon from "@/assets/images/kakaoIcon.svg";
import kakaoLoginText from "@/assets/images/kakaoLogin.svg";
import { useAuthStore } from "@/stores/authStore";
import { twMerge } from "tailwind-merge";

const email = ref("");
const password = ref("");
const passwordVisible = ref(false);

const isLoading = ref(false);
const isModalOpen = ref(false);
const modalMessage = ref("");
const loginSuccess = ref(false);
const modalSuccess = ref("");

const router = useRouter();

const authStore = useAuthStore();

// 로그인헀으면 홈으로 리다이렉트
onBeforeMount(() => {
  if (authStore.loginUser) {
    router.replace("/");
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await login(email.value, password.value);
    if (response && response.error) {
      if (response.error.message === "Invalid login credentials") {
        console.log("로그인 중 에러 발생: Invalid login credentials");
        throw new Error(response.error.message);
      }
    }
    console.log("로그인 성공: ", response);
    modalSuccess.value = `<b style='font-size: 18px; color: #000;'>로그인에 성공했습니다.</b>`;
    loginSuccess.value = true;
  } catch (error) {
    console.error(error);
    modalMessage.value = "<b style='font-size: 18px; color: #000;'>올바른 이메일과 비밀번호를 입력해주세요.</b>";
    isModalOpen.value = true;
  }
};

const handleLoginSuccess = () => {
  router.push("/");
  loginSuccess.value = false;
};

const kakaoLoginHandler = async () => {
  try {
    const { data: kakaoData, error: kakaoError } = await kakaoLogin();

    if (kakaoError) {
      // OAuth 호출 자체 실패
      console.log("카카오 로그인 실패: ", kakaoError);
      modalMessage.value = `<b style='font-size: 18px; color: #000;'>카카오 로그인 중 문제가 발생했습니다.<br />다시 시도해주세요.</b>`;
      return;
    }

    // OAuth 리디렉션 정상 작동
    console.log("카카오 로그인 성공: ", kakaoData);

    if (!kakaoData) {
      isLoading.value = true;
      modalMessage.value = `<b style='font-size: 18px; color: #000;'>카카오 로그인 리디렉션 중...</b>`;
      return;
    }
  } catch (error) {
    console.log("카카오 로그인 중 에러 발생: ", error);
    modalMessage.value = `<b style='font-size: 18px; color: #000;'>로그인 중 문제가 발생했습니다.</b>`;
    isModalOpen.value = true;
  }
};

const togglePasswordVisible = (e) => {
  e.preventDefault();
  passwordVisible.value = !passwordVisible.value;
};

// 모달 닫기
const toggleModal = () => {
  isModalOpen.value = false;
};

const navigateToSignUp = () => {
  router.push("/signUp");
};
</script>
<template>
  <div class="flex flex-col w-full min-h-[calc(100vh-144px)] items-center align-center">
    <Loading v-if="isLoading" />
    <h1 class="my-[72px] font-bold text-[36px]">로그인</h1>
    <div class="flex-grow flex flex-col w-[400px] mb-[80px]">
      <form @submit="handleSubmit" class="space-y-6">
        <InputField label="이메일" id="email" type="email" placeholder="이메일을 입력해 주세요" v-model="email" />
        <div class="relative w-full">
          <InputField
            label="비밀번호"
            id="password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="비밀번호를 입력해 주세요."
            v-model="password"
          />
          <button
            type="button"
            @click="togglePasswordVisible"
            class="absolute right-4 bottom-0 transform -translate-y-1/2"
          >
            <img :src="showPassword" alt="Show password " />
          </button>
        </div>
        <button
          type="submit"
          :class="
            twMerge(
              `w-full h-[48px]  rounded-[20px] flex items-center justify-center text-lg mt-4 
              ${email.trim().length > 0 && password.trim().length > 0 ? 'bg-[#f43630] text-white' : 'bg-[#d9d9d9] text-[#999996]'}`,
            )
          "
        >
          로그인
        </button>
      </form>
      <div class="flex w-[400px] justify-between my-6">
        <button class="text-[#999996] text-sm underline">계정정보를 잊으셨나요?</button>
        <button class="text-[#999996] text-sm" @click="navigateToSignUp">회원가입하기</button>
      </div>
      <button class="flex justify-center" @click="kakaoLoginHandler">
        <div class="flex w-[400px] h-[48px] items-center justify-center rounded-[20px] bg-[#FAE100] gap-x-1">
          <img :src="kakaoIcon" alt="카카오" />
          <img :src="kakaoLoginText" alt="카카오로 로그인" />
        </div>
      </button>
    </div>
    <ConfirmModal :isOpen="loginSuccess" :message="modalSuccess" :buttonMessage="'확인'" @close="handleLoginSuccess">
    </ConfirmModal>
    <ConfirmModal :isOpen="isModalOpen" :message="modalMessage" :buttonMessage="'확인'" @close="toggleModal">
    </ConfirmModal>
  </div>
</template>
<style scoped></style>
