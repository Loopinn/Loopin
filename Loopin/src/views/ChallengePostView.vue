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
    <div class="bg-white w-[440px] h-[105px] top-[205px] left-[80px] absolute rounded-[20px]">
      <img
        src="https://i.pinimg.com/474x/7b/ba/01/7bba01bf74ea2597285004f06c7a7bd0.jpg"
        alt="hostprofile"
        class="w-[60px] h-[60px] rounded-full absolute left-[190px] top-[-30px]"
      />
      <div class="text-center mt-[30px]">
        <p class="text-[12px] mb-1">호스트명</p>
        <p class="text-[20px] font-bold">게시글 제목</p>
      </div>
    </div>
    <!-- 한줄 요약 -->
    <div class="bg-[#f1f1f1] min-h-screen pb-[120px]">
      <div class="pt-[50px]">
        <div class="text-center text-[#403F3F] mt-2">
          <img src="@/assets/images/calendar.svg" alt="calendar" class="inline-block" />
          <span class="mr-2">2.2(일) 4주간</span>
          <img src="@/assets/images/stamp.svg" alt="stamp" class="inline-block" />
          <span class="mr-2">매일 인증</span>
          <img src="@/assets/images/members.svg" alt="membercount" class="inline-block" />
          <span>12/14</span>
        </div>
        <div class="ml-[40px] mt-[70px] w-[520px]">
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

                <router-link to="#" class="underline">취미</router-link>
                <span> > </span>
                <router-link to="#" class="underline">음악감상</router-link>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/members.svg" alt="members" />
                <p>12/14명 선착순</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/calendar.svg" alt="calendar" />
                <p>매일 인증</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/location.svg" alt="location" />
                <p>4주 진행 - 25.2.2(일) ~ 25.2.15(토)</p>
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
