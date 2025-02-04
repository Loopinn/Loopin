<script setup>
import supabase from "@/config/supabase";
import { twMerge } from "tailwind-merge";
import { onBeforeMount, onMounted, ref, watch, watchEffect } from "vue";
import imgEditIcon from "../assets/images/profile_edit.svg";
import CheckPw from "@/components/profileEdit/CheckPw.vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { passwordRegex } from "@/constants/validation";
import { toast } from "vue3-toastify";
import { resizeImage } from "@/utils/resizeImage";

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

  newDesc.value = loginUser.description;
});
onMounted(() => {
  if (loginUser.profile_img) {
    resizeProfile(loginUser.profile_img);
  }
});

const resizedProfile = ref(null);
const image = ref(null);
const preImg = ref(null);
//선택한 이미지 미리보기 리사이즈 추가
const handleImgSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    image.value = file;
  } else {
    image.value = null;
  }

  // 이미지 파일을 읽어들임
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // 리사이징된 이미지 URL 얻기
      const resizedImgUrl = resizeImage(img, 400, 400);
      preImg.value = resizedImgUrl;
    };

    img.src = event.target.result; // FileReader로 읽어온 데이터
  };

  reader.readAsDataURL(file); // 파일을 읽어 Data URL로 변환
};
//외부 이미지 리사이즈
//이미지를 로드할 때 CORS 설정을 추가하면 브라우저가 이미지에 대한 올바른 리소스 접근 권한을 처리할 수 있습니다.
const resizeProfile = (imgUrl) => {
  if (!imgUrl) {
    resizedProfile.value = null;
    return;
  }
  if (imgUrl && imgUrl.includes("k.kakaocdn.net")) {
    resizedProfile.value = imgUrl;
    return;
  }
  const img = new Image();
  img.crossOrigin = "anonymous"; // CORS 설정 추가
  img.onload = () => {
    // 리사이징된 이미지 URL 얻기
    resizedProfile.value = resizeImage(img, 400, 400);
  };
  img.src = imgUrl; // 외부 URL에서 이미지 로드
};

// 닉네임 중복 체크
const isVaild = ref(true);
const isConfirm = ref(false);

const checkNickname = async (newNickname) => {
  if (newNickname === loginUser.nickname) {
    // isConfirm.value = true;
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

// 프로필변경 업데이트 요청함수
const updateProfile = async () => {
  if (
    newNickname.value === loginUser.nickname &&
    newDesc.value === loginUser.description &&
    !image.value &&
    !newPassword.value.length &&
    !checkNewPassword.value.length
  ) {
    return router.push("/profile");
  }

  // 닉네임 중복확인
  if (newNickname.value !== loginUser.nickname && !isConfirm.value) {
    return toast.warn("닉네임 중복확인을 해주세요!");
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

      toast("비밀번호 변경 완료");
    } else {
      isCheckPw.value = false;
      return toast("비밀번호가 맞지 않습니다!");
    }
  }

  let imageUrl = currentUser?.value?.profile_img;

  if (preImg.value) {
    const fileName = `${Date.now()}-${image.value.name}`;
    const { data: imageData, error: imageError } = await supabase.storage
      .from("profile-images")
      .upload(`images/${fileName}`, image.value);

    if (imageError) throw new Error(imageError);

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

  updateUser({
    nickname: userUpdate.nickname,
    description: userUpdate.description,
    profile_img: userUpdate.profile_img,
  });
  toast.success("변경이 완료되었습니다!");
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
                  v-if="resizedProfile && !preImg"
                  :src="resizedProfile"
                  alt="프로필 사진"
                  class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                <img
                  v-else-if="preImg"
                  :src="preImg"
                  alt="프로필 사진"
                  class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                <img
                  v-else
                  src="@/assets/images/no-profile.svg"
                  alt="프로필 사진"
                  class="w-32 h-32 rounded-full shadow-md object-cover"
                />
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
                <p class="text-sm text-gray-500">이미지 형식의 파일을 업로드해주세요</p>
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
