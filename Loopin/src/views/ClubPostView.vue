<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
</script>
<template>
  <div class="mx-auto w-[600px] relative">
    <img
      class="w-full h-[260px]"
      src="https://cdn.pixabay.com/photo/2019/12/29/17/45/winter-4727668_640.jpg"
      alt="thumbnail"
    />
    <div class="bg-[#f1f1f1] h-max-full pb-[120px] pt-11">
      <div class="w-[440px] h-[80px] flex gap-7">
        <div class="ml-[40px]">
          <img
            src="https://i.pinimg.com/474x/7b/ba/01/7bba01bf74ea2597285004f06c7a7bd0.jpg"
            alt="hostprofile"
            class="w-[60px] h-[60px] rounded-full"
          />
          <div>
            <img
              src="@/assets/images/members_gray.svg"
              alt="memberscount"
              class="inline-block"
            />
            <span class="ml-1 text-[12px] text-[#403F3F]">19/20명</span>
          </div>
        </div>
        <div class="mt-2">
          <p class="text-[20px] font-bold mb-1">게시글 제목</p>
          <p class="text-[12px]">호스트명</p>
        </div>
      </div>
      <div>
        <div class="ml-[40px] mt-[30px] w-[520px]">
          <div>게시글 내용</div>
          <!-- 멤버 소개 -->
          <MemberInfo />
          <!-- 안내사항 -->
          <div class="mt-5">
            <div class="text-[#FF0000]">안내사항</div>
            <div class="font-bold">자세한 정보를 알려드릴게요</div>
            <div class="mt-2">
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/category.svg" alt="category" />

                <router-link to="#" class="underline">자기계발</router-link>
                <span> > </span>
                <router-link to="#" class="underline">재테크</router-link>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/members.svg" alt="members" />
                <p>20명</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/location.svg" alt="location" />
                <p>온라인</p>
              </div>
            </div>
          </div>
          <!-- 댓글 -->
          <Comment />
        </div>
      </div>
      <!-- 참여하기 -->
      <Register />
    </div>
  </div>
</template>
<style scoped></style>
