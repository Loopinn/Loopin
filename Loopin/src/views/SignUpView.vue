<script setup>
import { ref } from "vue";

import InputField from "@/components/Input/InputField.vue";
import ConfirmModal from "@/components/modal/ConfirmModal.vue";
import ChoiceModal from "@/components/modal/ChoiceModal.vue";

import showPassword from "@/assets/images/show-password.svg";

const email = ref("");
const password = ref("");
const verifyPassword = ref("");
const name = ref("");

const passwordVisible = ref(false);
const verifyPasswordVisible = ref(false);

const isModalOpen = ref(false);
const modalMessage = ref("<b style='font-size: 22px; color: #000;'>회원가입이 완료되었습니다</b>");

const handleSubmit = (e) => {
  e.preventDefault();
  console.log({
    email: email.value,
    password: password.value,
    verifyPassword: verifyPassword.value,
    name: name.value,
  });
  isModalOpen.value = true;
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
    <!-- <ChoiceModal :isOpen="isModalOpen" :message="modalMessage" :buttonMessage="'신청'" @close="toggleModal">
    </ChoiceModal> -->
  </div>
</template>
