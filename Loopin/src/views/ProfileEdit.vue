<script setup>
import supabase from "@/config/supabase";
import { twMerge } from "tailwind-merge";
import { onBeforeMount, ref, watchEffect } from "vue";
import imgEditIcon from "../assets/images/profile_edit.svg";
import CheckPw from "@/components/profileEdit/CheckPw.vue";

const checkPW = ref(false);
watchEffect(() => {
  console.log(checkPW.value);
});

const currentUser = ref(null);
const newNickname = ref(null);
const newDesc = ref(null);

onBeforeMount(async () => {
  const { data, error } = await supabase.from("userinfo").select().eq("nickname", "테스트용");
  if (error) throw new Error("유저 에러" + error);
  console.log(data[0]);
  currentUser.value = data[0];

  newNickname.value = data[0].nickname;
  newDesc.value = data[0].description;
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

const isVaild = ref(true);
const isConfirm = ref(false);

const checkNickname = async (newNickname) => {
  if (newNickname === currentUser.value.nickname) {
    isConfirm.value = true;
    return alert("사용 가능합니다 !");
  }
  try {
    const { data, error } = await supabase.from("userinfo").select("nickname").eq("nickname", newNickname);
    if (error) {
      alert("오류가 발생했습니다");
      throw new Error("오류 발생" + error);
    }

    if (data.length > 0) {
      isVaild.value = false;
      isConfirm.value = false;
      alert("닉네임이 이미 사용 중 입니다!");
    } else {
      isVaild.value = true;
      isConfirm.value = true;
      alert("사용 가능한 닉네임입니다!");
    }
  } catch (error) {
    console.error(error);
  }
};

// 비밀번호 변경
const newPassword = ref("");
const checkNewPassword = ref("");
const isCheckPw = ref(true);

const updateProfile = async () => {
  // 닉네임 중복확인
  if (newNickname.value !== currentUser.value.nickname && !isConfirm.value) {
    return alert("닉네임 중복확인을 해주세요!");
  } else {
    isConfirm.value = true;
  }

  // 비밀번호 확인
  if (newPassword.value.length > 0) {
    // 비밀번호 체크
    if (newPassword.value === checkNewPassword.value) {
      const response = await supabase.auth.updateUser({
        password: newPassword.value,
      });

      if (response.error) {
        alert("비밀번호 변경 실패!");
        throw new Error("비밀번호 변경 에러" + response.error);
      }

      console.log(response);
      alert("비밀번호 변경 완료");
    } else {
      isCheckPw.value = false;
      return alert("비밀번호가 맞지 않습니다!");
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

  if (imageUrl !== currentUser.value.profile_img) {
    updateData.profile_img = imageUrl;
  }

  const { data, error } = await supabase.auth.updateUser({ data: updateData });
  if (error) {
    alert("변경 실패하였습니다");
    throw new Error("유저 업데이트 오류" + error);
  }
  console.log(data);
  alert("변경이 완료되었습니다!");
};
</script>
<template>
  <div v-if="checkPW">
    <div v-if="currentUser && checkPW" class="px-5 flex flex-col gap-10 justify-center mt-[70px]">
      <div>
        <h2 class="font-extrabold text-[27px] mb-[50px]">프로필 변경</h2>
        <div class="relative w-[75px] h-[75px]">
          <img
            v-if="currentUser.profile_img && !preImg"
            :src="currentUser.profile_img"
            alt="프로필 사진"
            class="w-[75px] h-[75px] rounded-full border"
          />
          <img
            v-else-if="currentUser.profile_img && preImg"
            :src="preImg"
            alt=""
            class="w-full h-full rounded-full border"
          />
          <div v-else class="w-[75px] h-[75px] rounded-full bg-white border relative cursor-pointer"></div>
          <label for="profile_img" class="cursor-pointer">
            <img
              :src="imgEditIcon"
              alt="프로필이미지 변경 아이콘"
              class="w-[30px] h-[30px] absolute right-[-5px] bottom-0"
            />
          </label>
          <input id="profile_img" type="file" accept="image/*" class="hidden" @change="handleImgSelect($event)" />
        </div>
      </div>

      <div class="flex flex-col">
        <label for="nickname" class="text-[14px]">닉네임 변경</label>
        <div class="">
          <input
            id="nickname"
            type="text"
            v-model="newNickname"
            :class="
              twMerge(
                `border border-[#d9d9d9] rounded-[10px] w-[255px] h-[50px] text-[18px] px-3 outline-none ${!isVaild && 'border-red-500 border-2'}`,
              )
            "
          />
          <button
            type="button"
            @click="checkNickname(newNickname)"
            class="bg-[#9f9f9f] text-white w-[80px] h-[50px] ml-2 rounded-[10px]"
          >
            중복 확인
          </button>
        </div>
      </div>

      <div class="flex flex-col">
        <label for="nickname" class="text-[14px]">소개 변경</label>
        <textarea
          v-model="newDesc"
          class="border resize-none w-[400px] h-[140px] px-3 py-2 rounded-[10px] outline-none"
        />
      </div>

      <!-- 비밀번호 변경 -->
      <div>
        <div class="flex flex-col">
          <label for="newPw" class="text-[14px]">새 비밀번호</label>
          <div class="">
            <input
              id="newPw"
              type="password"
              v-model="newPassword"
              :class="
                twMerge(`border border-[#d9d9d9] rounded-[10px] w-[220px] h-[50px] text-[18px] px-3 outline-none`)
              "
            />
          </div>
        </div>
        <div class="flex flex-col mt-3">
          <label for="checkNewPw" class="text-[14px]">새 비밀번호 확인</label>
          <div class="">
            <input
              id="checkNewPw"
              type="password"
              v-model="checkNewPassword"
              :class="
                twMerge(
                  `border border-[#d9d9d9] rounded-[10px] w-[220px] h-[50px] text-[18px] px-3 outline-none ${!isCheckPw && 'border-red-500 border-2'}`,
                )
              "
            />
          </div>
        </div>
      </div>
      <div class="flex gap-32 justify-center mt-[40px]">
        <button type="button" class="w-[130px] h-[50px] border border-black font-bold rounded-[15px] text-[18px]">
          취소
        </button>
        <button
          type="button"
          @click="updateProfile"
          class="w-[130px] h-[50px] bg-[#F43630] text-white font-bold rounded-[15px] text-[18px]"
        >
          변경
        </button>
      </div>
    </div>
    <div v-else>로딩중</div>
  </div>
  <div v-else>
    <CheckPw v-if="currentUser" :uemail="currentUser.email" :checkPW="checkPW" @update:checkPW="checkPW = $event" />
  </div>
</template>
<style scoped></style>
