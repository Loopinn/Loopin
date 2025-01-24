<script setup>
import supabase from "@/config/supabase";
import { twMerge } from "tailwind-merge";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import imgEditIcon from "../assets/images/profile_edit.svg";
import CheckPw from "@/components/profileEdit/CheckPw.vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { passwordRegex } from "@/constants/validation";
import { toast } from "vue3-toastify";

const authStore = useAuthStore();
const { loginUser, updateUser } = authStore;

const router = useRouter();

const checkPW = ref(false);

const currentUser = ref(null);
const newNickname = ref(loginUser.nickname);
const newDesc = ref(null);

const isKakao = ref(false);

onBeforeMount(async () => {
  if (authStore.loginUser.provider === "kakao") {
    isKakao.value = true;
  }
  console.log(isKakao.value);

  // newNickname.value = loginUser.nickname;
  newDesc.value = loginUser.description;
});

const image = ref(null);
const preImg = ref(null);
const handleImgSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    image.value = file;
  } else {
    image.value = null;
  }

  const preImgUrl = URL.createObjectURL(file);
  console.log(preImgUrl);
  preImg.value = preImgUrl;
};

// 닉네임 중복 체크
const isVaild = ref(true);
const isConfirm = ref(false);

const checkNickname = async (newNickname) => {
  if (newNickname === loginUser.nickname) {
    isConfirm.value = true;
    return;
  }
  try {
    const { data, error } = await supabase.from("userinfo").select("nickname").eq("nickname", newNickname);
    if (error) {
      toast.error("오류가 발생했습니다");
      throw new Error("오류 발생" + error);
    }

    if (data.length > 0) {
      isVaild.value = false;
      isConfirm.value = false;
      toast.error("닉네임이 이미 사용 중 입니다!");
    } else {
      isVaild.value = true;
      isConfirm.value = true;
    }
  } catch (error) {
    console.error(error);
  }
};

// 닉네임 중복확인 후 다시 변경한다면 중복확인 버튼 다시 띄우기
watch(newNickname, () => {
  isConfirm.value = false;
});

// 비밀번호 변경
const newPassword = ref("");
const checkNewPassword = ref("");
const isCheckPw = ref(true);

// 유효성 검사 함수
const validatePassword = (password) => passwordRegex.test(password);

const updateProfile = async () => {
  // 닉네임 중복확인
  if (newNickname.value !== loginUser.nickname && !isConfirm.value) {
    return toast.warn("닉네임 중복확인을 해주세요!");
  } else {
    isConfirm.value = true;
  }

  // 비밀번호 확인
  if (newPassword.value.length > 0) {
    if (!validatePassword(newPassword.value)) {
      return toast.error("비밀번호는 8~16자의 길이이며, 소문자, 대문자, 숫자, 특수문자를 모두 포함해야 합니다.");
    }
    // 비밀번호 체크
    if (newPassword.value === checkNewPassword.value) {
      const response = await supabase.auth.updateUser({
        password: newPassword.value,
      });

      if (response.error) {
        toast("비밀번호 변경 실패!");
        throw new Error("비밀번호 변경 에러" + response.error);
      }

      console.log(response);
      toast("비밀번호 변경 완료");
    } else {
      isCheckPw.value = false;
      return toast("비밀번호가 맞지 않습니다!");
    }
  }

  let imageUrl = currentUser?.value?.profile_img;
  console.log(preImg.value);
  if (preImg.value) {
    const fileName = `${Date.now()}-${image.value.name}`;
    const { data: imageData, error: imageError } = await supabase.storage
      .from("profile-images")
      .upload(`images/${fileName}`, image.value);

    if (imageError) throw new Error(imageError);
    console.log(imageData);

    const { data: imagePath } = supabase.storage.from("profile-images").getPublicUrl(`images/${fileName}`);
    imageUrl = imagePath.publicUrl;
  }

  const updateData = {
    nickname: newNickname.value,
    description: newDesc.value,
  };

  if (imageUrl !== loginUser.profile_img) {
    updateData.profile_img = imageUrl;
  }

  const { data, error } = await supabase.auth.updateUser({ data: updateData });
  if (error) {
    toast("변경 실패하였습니다");
    throw new Error("유저 업데이트 오류" + error);
  }
  const userUpdate = data.user.user_metadata;
  console.log(data);
  updateUser({
    nickname: userUpdate.nickname,
    description: userUpdate.description,
    profile_img: userUpdate.profile_img,
  });
  toast("변경이 완료되었습니다!");
  router.push("/profile");
};

const cancelUpdate = () => {
  router.push("/profile");
};
</script>
<template>
  <div v-if="checkPW">
    <div v-if="loginUser && checkPW" class="bg-gray-50">
      <div class="">
        <div class="bg-white">
          <!-- 헤더 섹션 -->
          <div class="px-8 py-6 bg-gradient-to-r from-[#F43630] to-[#FF6B66]">
            <h1 class="text-2xl font-bold text-white">프로필 설정</h1>
            <p class="text-red-100 mt-1">개인정보와 프로필을 관리하세요</p>
          </div>

          <!-- 프로필 수정 폼 -->
          <div class="p-8">
            <!-- 프로필 이미지 섹션 -->
            <div class="flex items-center space-x-8 mb-8 pb-8 border-b border-gray-200">
              <div class="relative">
                <img
                  v-if="loginUser.profile_img && !preImg"
                  :src="loginUser.profile_img"
                  alt="프로필 사진"
                  class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                <img
                  v-else-if="loginUser.profile_img && preImg"
                  :src="preImg"
                  alt="프로필 사진"
                  class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div v-else class="w-32 h-32 rounded-full bg-white border-4 border-white shadow-md"></div>
                <label
                  for="profile_img"
                  class="absolute bottom-0 right-[-5px] text-white p-2 rounded-full cursor-pointer"
                >
                  <img :src="imgEditIcon" alt="프로필이미지 변경" class="w-[35px] h-[35px]" />
                </label>
                <input id="profile_img" type="file" accept="image/*" class="hidden" @change="handleImgSelect($event)" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-1">프로필 사진</h3>
                <p class="text-sm text-gray-500">JPG, PNG 형식의 이미지를 업로드해주세요</p>
              </div>
            </div>

            <!-- 기본 정보 폼 -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                <div class="flex items-center gap-3">
                  <input
                    type="text"
                    v-model="newNickname"
                    :disabled="isKakao"
                    :class="
                      twMerge(
                        'w-[250px] px-4 py-2 border border-gray-300 rounded-lg outline-none',
                        !isVaild && 'border-red-500 border-2',
                      )
                    "
                  />
                  <button
                    v-if="!isConfirm"
                    type="button"
                    @click="checkNickname(newNickname)"
                    :disabled="isKakao"
                    class="px-4 py-2 bg-[#F43630] text-white font-medium rounded-lg hover:bg-[#E02E28] transition-colors disabled:opacity-50"
                  >
                    중복 확인
                  </button>
                  <span v-else class="text-green-500 font-medium">사용 가능한 닉네임입니다</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">한줄 소개</label>
                <textarea
                  v-model="newDesc"
                  rows="3"
                  class="w-full h-[150px] px-4 py-2 border border-gray-300 rounded-lg outline-none resize-none"
                ></textarea>
              </div>

              <!-- 비밀번호 변경 섹션 -->
              <div v-if="!isKakao" class="pt-6 border-t border-gray-200">
                <h3 class="text-lg font-medium text-gray-900 mb-4">비밀번호 변경</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                    <input
                      type="password"
                      v-model="newPassword"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
                    <input
                      type="password"
                      v-model="checkNewPassword"
                      :class="
                        twMerge(
                          'w-full px-4 py-2 border border-gray-300 rounded-lg outline-none',
                          !isCheckPw && 'border-red-500 border-2',
                        )
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 버튼 섹션 -->
            <div class="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                @click="cancelUpdate"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                @click="updateProfile"
                class="px-6 py-3 bg-[#F43630] text-white font-medium rounded-lg hover:bg-[#E02E28] transition-colors"
              >
                변경사항 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-xl text-gray-600">로딩중...</div>
    </div>
  </div>
  <div v-else>
    <CheckPw
      v-if="loginUser"
      :uemail="loginUser.email"
      :checkPW="checkPW"
      @update:checkPW="checkPW = $event"
      :isKakao="isKakao"
    />
  </div>
</template>
<style scoped></style>
