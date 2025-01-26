<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted } from "vue";
import { useRoute } from "vue-router";

const postStore = usePostStore();
const { challengePosts } = storeToRefs(postStore);
const { loadChallengePosts } = postStore;

const route = useRoute();
const postId = route.params.id;

const currentPost = computed(() => {
  return challengePosts.value.find((post) => post.id === postId);
});

onBeforeMount(() => {
  loadChallengePosts();
});

const formattedDate = (dateString) => {
  const [_, month, day] = dateString.split("-");

  const date = new Date(dateString);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = weekdays[date.getDay()];

  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");

  return `${formattedMonth}.${formattedDay}(${dayOfWeek})`;
};
const startDate = computed(() => {
  return formattedDate(currentPost.value.start_date);
});

const endDate = computed(() => {
  return formattedDate(currentPost.value.end_date);
});

const period = computed(() => {
  const start = new Date(currentPost.value.start_date);
  const end = new Date(currentPost.value.end_date);

  return (end - start) / (1000 * 60 * 60 * 24) + 1;
});
</script>
<template>
  <div v-if="currentPost" class="mx-auto w-[600px] relative">
    <img class="w-full h-[260px]" :src="currentPost.images ? currentPost.images[0] : ' '" alt="thumbnail" />
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
          <span class="mr-2">{{ startDate }} {{ period }}일간</span>
          <img src="@/assets/images/stamp.svg" alt="stamp" class="inline-block" />
          <span class="mr-2">{{ currentPost.times_per_week }}</span>
          <img src="@/assets/images/members.svg" alt="membercount" class="inline-block" />
          <span>12/14</span>
        </div>
        <div class="ml-[40px] mt-[70px] w-[520px]">
          <div>게시글 내용</div>
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
                <p>
                  {{ currentPost.participants ? "currentPost.participants.length" : 0 }}/{{ currentPost.max_people }}명
                  선착순
                </p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/calendar.svg" alt="calendar" />
                <p>{{ currentPost.times_per_week }}</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/location.svg" alt="location" />
                <p>{{ period }}일간 진행 - {{ startDate }}~ {{ endDate }}</p>
              </div>
            </div>
          </div>
          <!-- 댓글 -->
          <Comment :likes="currentPost.likes" :comments="currentPost.comments" />
        </div>
      </div>
      <!-- 참여하기 -->
      <Register />
    </div>
  </div>
</template>
<style scoped></style>
