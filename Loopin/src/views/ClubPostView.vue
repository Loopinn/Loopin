<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { computed, onBeforeMount, onMounted } from "vue";

const postStore = usePostStore();
const { clubPosts } = storeToRefs(postStore);
const { loadClubPosts } = postStore;

const route = useRoute();
const postId = route.params.id;

const currentPost = computed(() => {
  return clubPosts.value.find((post) => post.id === postId);
});

onBeforeMount(() => {
  loadClubPosts();
});
</script>
<template>
  <div class="mx-auto w-[600px] relative">
    <img class="w-full h-[260px]" :src="currentPost.images ? currentPost.images[0] : ''" alt="thumbnail" />
    <div class="bg-[#f1f1f1] min-h-screen pb-[120px] pt-11">
      <div class="ml-[40px] w-[520px]">
        <div class="h-[80px] flex gap-4">
          <div class="flex-shrink-0">
            <img
              src="https://i.pinimg.com/474x/7b/ba/01/7bba01bf74ea2597285004f06c7a7bd0.jpg"
              alt="hostprofile"
              class="w-[60px] h-[60px] rounded-full"
            />
            <div>
              <img src="@/assets/images/members_gray.svg" alt="memberscount" class="inline-block" />
              <span class="ml-1 text-[12px] text-[#403F3F]"
                >{{ currentPost.participants ? "currentPost.participants.length" : 0 }}/{{
                  currentPost.max_people
                }}명</span
              >
            </div>
          </div>
          <div class="mt-1 flex flex-col justify-center">
            <p class="text-[20px] font-bold mb-1">{{ currentPost.title }}</p>
            <p class="text-[12px]">호스트 햄</p>
          </div>
        </div>

        <div class="mt-[30px]">
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
                <p>{{ currentPost.max_people }}명</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/location.svg" alt="location" />
                <p>{{ currentPost.place }}</p>
              </div>
            </div>
          </div>
          <!-- 댓글 -->
          <Comment :likes="currentPost.likes" :comments="currentPost.comments" />
        </div>
      </div>
    </div>

    <!-- 참여하기 -->
    <Register />
  </div>
</template>
<style scoped></style>
