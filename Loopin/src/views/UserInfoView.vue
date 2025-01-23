<script setup>
import Following from "@/components/common/Following.vue";
import NoPosts from "@/components/common/NoPosts.vue";
import UserInfoFeed from "@/components/userinfo/UserInfoFeed.vue";
import UserInfoMeeting from "@/components/userinfo/UserInfoMeeting.vue";
import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";
import { twMerge } from "tailwind-merge";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const isMyPage = ref(true);

const authStore = useAuthStore();
const { loginUser } = authStore;

const router = useRouter();
const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    console.log(decodeURIComponent(newPath.split("/")[2]));
    if (newPath === "/profile") {
      isMyPage.value = true;
    } else {
      isMyPage.value = false;
    }
  },
);

const userNickName = route.params.id;

const userData = ref(null); // 유저페이지/유저데이터

const userMeetingPosts = ref([]);
const userFeedPosts = ref([]);

const infos = computed(() => {
  return [
    {
      name: "팔로워",
      value: isMyPage.value ? loginUser.followers.length || 0 : userData.value?.followers.length || 0,
    },
    {
      name: "팔로잉",
      value: isMyPage.value ? loginUser.following.length || 0 : userData.value?.following.length || 0,
    },
    {
      name: "피드",
      value: isMyPage.value ? loginUser.posts?.length || 0 : userData.value?.posts.length || 0,
    },
  ];
});
const feedNav = ref("피드");

const isFollowing = ref(false);

onBeforeMount(async () => {
  console.log(route.fullPath);
  if (loginUser && decodeURIComponent(route.path.split("/")[2]) === loginUser.nickname) {
    router.replace("/profile");
  }

  if (route.path.includes("user")) {
    isMyPage.value = false;
  }
  console.log("마이페이지 입니까?", isMyPage.value);

  if (isMyPage.value) {
    console.log(loginUser);
    try {
      if (loginUser.posts) {
        // 모임 게시글 불러오기
        const filterMeetingId = loginUser.posts.filter((postInfo) => {
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
        const filterFeedId = loginUser.posts.filter((postInfo) => {
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
    }
  } else {
    try {
      const { data, error } = await supabase.from("userinfo").select().eq("nickname", userNickName);
      if (error) throw new Error("유저 정보 불러오기 실패" + error);

      userData.value = data[0];
      console.log("유저정보", userData.value);

      // if (loginUser && loginUser.following?.includes(userData.value.id)) {
      //   isFollowing.value = true;
      // } else {
      //   isFollowing.value = false;
      // }

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
    }
  }
});

const shortDesc = computed(() => {
  const desc = isMyPage.value ? loginUser?.description || "" : userData.value?.description || "";

  if (desc.length >= 40 && !moreDesc.value) {
    return desc.slice(0, 38) + "...";
  } else {
    return desc;
  }
});
const moreDesc = ref(false);

const toggleFollow = async (userId) => {
  if (!loginUser) {
    alert("로그인이 필요합니다.");
    return;
  }

  // const isFollowing = loginUser.following?.includes(userId);
  let updatedFollowing = loginUser.following || [];

  if (isFollowing.value) {
    updatedFollowing = updatedFollowing.filter((id) => id !== userId);
  } else {
    updatedFollowing.push(userId);
  }

  const { data, error } = await supabase
    .from("userinfo")
    .update({ following: updatedFollowing })
    .eq("id", loginUser.id)
    .select();
  console.log(data);
  if (error) {
    console.error("Failed to update following list:", error.message);
    return;
  }

  loginUser.following = updatedFollowing;
};

const handleShare = () => {
  navigator.clipboard
    .writeText(`http://localhost:5173/user/${route.params.id}`)
    .then(() => alert("프로필 주소가 복사되었습니다!"));
};
</script>
<template>
  <div>
    <div class="py-5 px-3">
      <img
        v-if="isMyPage ? loginUser.profile_img : userData?.profile_img"
        :src="isMyPage ? loginUser.profile_img : userData.profile_img"
        alt="프로필 사진"
        class="w-[75px] h-[75px] rounded-full"
      />
      <div v-else class="w-[75px] h-[75px] rounded-full bg-white border"></div>
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
        class="text-[14px] border w-[170px] h-[40px] rounded-[10px]"
        @click="router.push('/profile/edit')"
      >
        프로필 변경
      </button>
      <button type="button" class="text-[14px] border w-[170px] h-[40px] rounded-[10px]" @click="handleShare">
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
      <!-- <button
        v-else-if="!isMyPage && loginUser"
        type="button"
        class="bg-[#F43630] text-white w-[65px] h-[30px] rounded-[25px]"
        @click="toggleFollow(userData.id)"
      >
        {{ isFollowing ? "언팔로우" : "팔로잉" }}
      </button> -->
      <Following v-else-if="!isMyPage && loginUser && userData" :userId="userData.id" />
    </div>

    <!-- 피드 정보 -->
    <div :class="`mt-10 bg-[#f4f4f4] ${!isMyPage ? 'min-h-[750px]' : 'min-h-[700px]'}`">
      <ul class="h-[45px] flex bg-white">
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
              `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '태그' ? 'border-black' : ''}`,
            )
          "
          @click="feedNav = '태그'"
        >
          태그
        </li>
        <li
          :class="
            twMerge(
              `flex-1 flex items-center justify-center cursor-pointer border-b border-transparent ${feedNav === '모임' ? 'border-black' : ''}`,
            )
          "
          @click="feedNav = '모임'"
        >
          모임
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
      <div v-else-if="feedNav === '모임'" class="px-4 mt-4">
        <UserInfoMeeting :meeting-data="userMeetingPosts" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
