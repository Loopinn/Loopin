<script setup>
import Following from "@/components/common/Following.vue";
import NoPosts from "@/components/common/NoPosts.vue";
import Loading from "@/components/Loading.vue";
import JoiningPosts from "@/components/userinfo/JoiningPosts.vue";
import NoUser from "@/components/userinfo/NoUser.vue";
import UserInfoFeed from "@/components/userinfo/UserInfoFeed.vue";
import UserInfoMeeting from "@/components/userinfo/UserInfoMeeting.vue";
import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";
import { resizeImage } from "@/utils/resizeImage";
import { storeToRefs } from "pinia";
import { twMerge } from "tailwind-merge";
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const isMyPage = ref(true);

const authStore = useAuthStore();
const { loginUser } = storeToRefs(authStore);

const router = useRouter();
const route = useRoute();

watch(
  () => route.path,
  async (newPath) => {
    if (newPath === "/profile") {
      isMyPage.value = true;
    } else if (newPath.split("/")[1] === "user") {
      userNickName.value = route.params.id;
      isMyPage.value = false;
    }
    isLoading.value = true;
    await fetchData();
    resizeProfile();
  },
);

const userNickName = ref(route.params.id);

const userData = ref(null); // 유저페이지/유저데이터

const noUser = ref(false);

const userMeetingPosts = ref([]);
const userFeedPosts = ref([]);

const infos = computed(() => {
  return [
    {
      name: "팔로워",
      value: isMyPage.value ? loginUser.value.followers.length || 0 : userData.value.followers.length || 0,
    },
    {
      name: "팔로잉",
      value: isMyPage.value ? loginUser.value.following.length || 0 : userData.value.following.length || 0,
    },
    {
      name: "피드",
      value: isMyPage.value ? loginUser.value.posts.length || 0 : userData.value.posts.length || 0,
    },
  ];
});
const feedNav = ref("피드");

const isLoading = ref(true);

const fetchData = async () => {
  console.log(route.fullPath);

  if (isMyPage.value) {
    console.log(loginUser.value);
    try {
      if (loginUser.value.posts) {
        // 모임 게시글 불러오기
        const filterMeetingId = loginUser.value.posts.filter((postInfo) => {
          const info = JSON.parse(postInfo);
          return info.type !== "lounge_posts";
        });
        console.log(filterMeetingId);

        const meeting = filterMeetingId.map(async (meetingId) => {
          const info = JSON.parse(meetingId);
          const { data, error } = await supabase.from(`${info.type}`).select().eq("id", info.id);
          if (error) throw new Error("모임 게시글 정보 불러오기 실패", error);
          return { data: data[0], type: info.type };
        });

        userMeetingPosts.value = await Promise.all(meeting);
        console.log("모임 게시글", userMeetingPosts.value);
        // 피드 게시글 불러오기
        const filterFeedId = loginUser.value.posts.filter((postInfo) => {
          const info = JSON.parse(postInfo);
          return info.type === "lounge_posts";
        });

        const feed = filterFeedId.map(async (meetingId) => {
          const info = JSON.parse(meetingId);
          const { data, error } = await supabase.from(`${info.type}`).select().eq("id", info.id);
          if (error) throw new Error("피드 게시글 정보 불러오기 실패", error);

          return data[0];
        });
        userFeedPosts.value = await Promise.all(feed);
        console.log("피드 게시글", userFeedPosts.value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  } else {
    try {
      const { data, error } = await supabase.from("userinfo").select().eq("nickname", userNickName.value);
      console.log(userNickName);
      console.log(data, error);
      if (!data.length) {
        noUser.value = true;
        console.log(noUser.value);
        return;
      }

      userData.value = data[0];
      console.log("유저정보", userData.value);

      // 모임 게시글 불러오기
      const filterMeetingId = userData.value.posts.filter((postInfo) => {
        const info = JSON.parse(postInfo);
        return info.type !== "lounge_posts";
      });

      const meeting = filterMeetingId.map(async (meetingId) => {
        const info = JSON.parse(meetingId);
        const { data, error } = await supabase.from(`${info.type}`).select().eq("id", info.id);
        if (error) throw new Error("모임 게시글 정보 불러오기 실패", error);
        return { data: data[0], type: info.type };
      });
      console.log("meeting", meeting);

      userMeetingPosts.value = await Promise.all(meeting);
      console.log("모임 게시글", userMeetingPosts.value);
      // 피드 게시글 불러오기
      const filterFeedId = userData.value.posts.filter((postInfo) => {
        const info = JSON.parse(postInfo);
        return info.type === "lounge_posts";
      });

      const feed = filterFeedId.map(async (meetingId) => {
        const info = JSON.parse(meetingId);
        const { data, error } = await supabase.from(`${info.type}`).select().eq("id", info.id);
        if (error) throw new Error("피드 게시글 정보 불러오기 실패", error);

        return data[0];
      });
      userFeedPosts.value = await Promise.all(feed);
      console.log("피드 게시글", userFeedPosts.value);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
};

onBeforeMount(() => {
  console.log(loginUser);
  if (loginUser.value && decodeURIComponent(route.path.split("/")[2]) === loginUser.value.nickname) {
    router.replace("/profile");
  }

  if (route.path.includes("user")) {
    isMyPage.value = false;
  }
});

onMounted(async () => {
  await fetchData();
  resizeProfile();
});

const shortDesc = computed(() => {
  const desc = isMyPage.value ? loginUser.value.description || "" : userData.value?.description || "";

  if (desc.length >= 40 && !moreDesc.value) {
    return desc.slice(0, 38) + "...";
  } else {
    return desc;
  }
});
const moreDesc = ref(false);

const handleShare = () => {
  navigator.clipboard
    .writeText(`http://localhost:5173/user/${loginUser.value.nickname}`)
    .then(() => toast("프로필 주소가 복사되었습니다!"));
};

//프로필 이미지 리사이즈
const resizedProfile = ref(null);
const resizeProfile = () => {
  const img = new Image();
  img.crossOrigin = "anonymous"; // CORS 설정 추가
  img.onload = () => {
    // 리사이징된 이미지 URL 얻기
    resizedProfile.value = resizeImage(img, 200, 200);
  };
  // 외부 URL에서 이미지 로드
  if (isMyPage.value) img.src = loginUser.value.profile_img;
  else img.src = userData.value.profile_img;
};
</script>
<template>
  <div v-if="noUser">
    <NoUser />
  </div>
  <div v-else>
    <Loading :is-loading="isLoading" />

    <div v-if="!isLoading">
      <div class="py-5 px-3">
        <img
          v-if="resizedProfile"
          :src="resizedProfile"
          alt="프로필 사진"
          class="w-[75px] h-[75px] rounded-full shadow-md object-cover will-change-transform"
        />
        <img
          v-else
          src="@/assets/images/no-profile.svg"
          alt="프로필 사진"
          class="w-[75px] h-[75px] rounded-full shadow-md object-cover will-change-transform"
        />
        <h1 class="font-extrabold text-[18px] my-3">{{ isMyPage ? loginUser.nickname : userData?.nickname }}</h1>
        <p class="w-[350px] text-[#383535] break-words">
          {{ shortDesc }}
        </p>
        <p
          class="text-[#b9b6b6] hover:underline cursor-pointer"
          v-if="
            isMyPage
              ? loginUser?.description?.length >= 41 && !moreDesc
              : userData?.description?.length >= 41 && !moreDesc
          "
          @click="moreDesc = true"
        >
          ...더보기
        </p>
      </div>

      <!-- 마이페이지 (로그인한 유저) -->
      <div v-if="isMyPage" class="flex justify-center gap-8 my-10">
        <button
          type="button"
          class="text-[14px] border w-[170px] h-[40px] rounded-[10px] hover:bg-[#f4f4f4] transition-colors duration-150"
          @click="router.push('/profile/edit')"
        >
          프로필 변경
        </button>
        <button
          type="button"
          class="text-[14px] border w-[170px] h-[40px] rounded-[10px] hover:bg-[#f4f4f4] transition-colors duration-150"
          @click="handleShare"
        >
          프로필 공유
        </button>
      </div>

      <!-- 팔로워 피드 -->
      <div class="flex justify-between items-center mt-[20px] px-3">
        <div class="flex gap-5">
          <div v-for="(info, index) in infos" :key="index" class="flex flex-col items-center text-[14px]">
            <p class="">{{ info.name }}</p>
            <p class="font-bold">{{ info.value }}</p>
          </div>
        </div>
        <!-- 마이페이지 -->
        <button
          v-if="isMyPage"
          type="button"
          class="bg-white w-[65px] h-[30px] rounded-[25px] border"
          @click="router.push('/lounge/write')"
        >
          글쓰기
        </button>

        <!-- 로그인한 유저만 보임 -->
        <Following v-else-if="!isMyPage && loginUser && userData" :userData="userData" />
      </div>

      <!-- 피드 정보 -->
      <div :class="`mt-10 bg-[#f4f4f4] ${!isMyPage ? 'min-h-[750px]' : 'min-h-[700px]'}`">
        <ul class="h-[45px] flex bg-white sticky top-0 z-[5]">
          <li
            :class="
              twMerge(
                `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '피드' ? 'border-black' : ''}`,
              )
            "
            @click="feedNav = '피드'"
          >
            피드
          </li>
          <li
            :class="
              twMerge(
                `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '참가한 모임' ? 'border-black' : ''}`,
              )
            "
            @click="feedNav = '참가한 모임'"
          >
            참가한 모임
          </li>
          <li
            :class="
              twMerge(
                `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '내 게시글' ? 'border-black' : ''}`,
              )
            "
            @click="feedNav = '내 게시글'"
          >
            내 게시글
          </li>
        </ul>
        <div v-if="feedNav === '피드'">
          <div v-if="userFeedPosts.length > 0" class="flex flex-wrap">
            <UserInfoFeed v-for="userFeedPost in userFeedPosts" :feed-data="userFeedPost" />
          </div>
          <div v-else class="flex items-center justify-center h-[220px]">
            <NoPosts text="피드가 없네요!" css="text-[20px]" />
          </div>
        </div>
        <div v-else-if="feedNav === '내 게시글'" class="px-4 mt-4">
          <UserInfoMeeting :meeting-data="userMeetingPosts" :isMyPage="isMyPage" :userNickName="userNickName" />
        </div>
        <div v-else class="px-4 mt-4">
          <JoiningPosts :isMyPage="isMyPage" :userNickName="userNickName" :userJoinPosts="userData?.joinPosts" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
