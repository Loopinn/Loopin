<script setup>
import { ref, defineProps, computed } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const place_name = computed(() => {
  const placeString = props.post.place;

  function isJsonString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  if (isJsonString(placeString)) {
    return JSON.parse(placeString).place_name;
  } else return placeString;
});
// 좋아요 버튼
const like = ref(false);

const isLiked = () => {
  like.value = !like.value;
};
</script>
<template>
  <div class="h-[200px] flex rounded-2xl bg-white mb-6 cursor-pointer">
    <div class="relative">
      <img :src="post.images ? post.images[0] : ''" alt="thumbnail" class="w-40 h-40 rounded-2xl m-5" />
      <button @click="isLiked">
        <img
          :src="like ? './src/assets/images/likewhite_full.svg' : './src/assets/images/likewhite.svg'"
          alt="like"
          class="absolute left-7 bottom-7 w-10 h-10"
        />
      </button>
    </div>

    <div class="w-[340px] h-[200px] mt-5 space-y-[6px]">
      <!-- 카테고리 태그 -->
      <div class="bg-[#F4F4F4] text-[#666060] rounded-3xl inline-block text-center text-4 px-2 py-1 mr-[6px]">
        {{ post.category }}
      </div>

      <p class="text-[24px] truncate ...">{{ post.title }}</p>
      <p class="text-[#999999]">
        {{ post.type }} <img src="@/assets/images/location_gray.svg" alt="location" class="inline-block mb-2" />
        {{ place_name }}
      </p>
      <div class="flex items-center gap-1">
        <div class="flex -space-x-2">
          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />

          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
            alt="memberprofile"
            class="w-9 h-9 rounded-full border-2 border-white"
          />
          <!-- 참여 멤버 수가 6명 이상 ... -->
          <div class="relative w-9 h-9">
            <img
              src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
              alt="memberprofile"
              class="w-9 h-9 rounded-full border-2 border-white"
            />
            <img
              src="@/assets/images/more.svg"
              alt="more"
              class="absolute inset-0 w-9 h-9 rounded-full border-2 border-white bg-black bg-opacity-40"
            />
          </div>
        </div>
        <img src="@/assets/images/members_gray.svg" alt="participants" />
        <p class="text-[#999999]">{{ post.participants ? "post.participants.length" : 0 }}/{{ post.max_people }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
