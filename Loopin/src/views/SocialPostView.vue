<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const postStore = usePostStore();
const { socialingPosts } = storeToRefs(postStore);
const { loadSocialPosts } = postStore;

const route = useRoute();
const postId = route.params.id;

const currentPost = computed(() => {
  return socialingPosts.value.find((post) => post.id === postId);
});

onMounted(() => {
  loadSocialPosts();
  console.log(currentPost.value); // 현재 게시물 출력
});

const formattedDate = computed(() => {
  const dateString = currentPost.value.date;

  const [_, month, day] = dateString.split("-");

  const date = new Date(dateString);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = weekdays[date.getDay()];

  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");

  return `${formattedMonth}.${formattedDay}(${dayOfWeek})`;
});

const place_name = computed(() => {
  const placeString = currentPost.value.place;

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

const formattedTime = computed(() => {
  const timeString = currentPost.value.time;
  const timeObject = JSON.parse(timeString);

  let hours = timeObject.hours;
  const ampm = hours >= 12 ? "오후" : "오전";

  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = timeObject.minutes.toString().padStart(2, "0");

  return `${ampm} ${formattedHours}:${formattedMinutes}`;
});
</script>
<template>
  <div class="mx-auto w-[600px] relative">
    <img
      class="w-full h-[260px]"
      src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
      alt="thumbnail"
    />
    <div class="bg-white w-[440px] h-[105px] top-[205px] left-[80px] absolute rounded-[20px]">
      <img
        src="https://i.pinimg.com/474x/7b/ba/01/7bba01bf74ea2597285004f06c7a7bd0.jpg"
        alt="hostprofile"
        class="w-[60px] h-[60px] rounded-full absolute left-[190px] top-[-30px]"
      />
      <div class="text-center mt-[30px]">
        <p class="text-[12px] mb-1">호스트명</p>
        <p class="text-[20px] font-bold">{{ currentPost.title }}</p>
      </div>
    </div>
    <!-- 한줄 요약 -->
    <div class="bg-[#f1f1f1] min-h-screen pb-[120px]">
      <div class="pt-[50px]">
        <div class="text-center text-[#403F3F] mt-2">
          <img src="@/assets/images/calendar.svg" alt="calendar" class="inline-block" />
          <span>{{ place_name }} · {{ formattedDate }} {{ formattedTime }} </span>
          <img src="@/assets/images/star.svg" alt="star" class="ml-2 inline-block" />
          <span class="text-[#FFC508]">5.0 </span>
          <span class="text-[#909090]">(44)</span>
        </div>
        <div class="ml-[40px] mt-[70px] w-[520px]">
          <div>{{ currentPost.description }}</div>
          <!-- 멤버 소개 -->
          <MemberInfo :participants="currentPost.participants" />
          <!-- 안내사항 -->
          <div class="mt-5">
            <div class="text-[#FF0000]">안내사항</div>
            <div class="font-bold">자세한 정보를 알려드릴게요</div>
            <div class="mt-2">
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/category.svg" alt="category" />

                <router-link to="#" class="underline">{{ currentPost.subject }}</router-link>
                <span> > </span>
                <router-link to="#" class="underline">{{ currentPost.category }}</router-link>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/members.svg" alt="members" />
                <p>최소 2명 최대 {{ currentPost.max_people }}명</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/calendar.svg" alt="calendar" />
                <p>모임날짜 · {{ formattedDate }} {{ formattedTime }}</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/location.svg" alt="location" />
                <p>{{ place_name }}</p>
              </div>
            </div>
          </div>
          <!-- 댓글 -->
          <Comment :likes="currentPost.likes" :comment="currentPost.comments" />
        </div>
      </div>
      <!-- 참여하기 -->
      <Register />
    </div>
  </div>
</template>
<style scoped></style>
