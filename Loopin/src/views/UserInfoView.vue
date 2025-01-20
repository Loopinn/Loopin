<script setup>
import UserInfoFeed from "@/components/userinfo/UserInfoFeed.vue";
import UserInfoMeeting from "@/components/userinfo/UserInfoMeeting.vue";
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { twMerge } from "tailwind-merge";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// 임시
const isMyPage = ref(true);
const currentUser = ref(null);

const postStore = usePostStore();
const { loadLoungePosts } = postStore;

const router = useRouter();
const route = useRoute();
const userNickName = route.params.id;
const userData = ref(null);

const userMeetingPosts = ref([]);
const userFeedPosts = ref([]);

const infos = computed(() => {
  return [
    {
      name: "팔로워",
      value: userData.value?.followers.length || 0,
    },
    {
      name: "팔로잉",
      value: userData.value?.following.length || 0,
    },
    {
      name: "피드",
      value: userData.value?.posts.length || 0,
    },
  ];
});
const feedNav = ref("피드");

onBeforeMount(async () => {
  // 임시
  const { data, error } = await supabase.from("userinfo").select().eq("nickname", "테스트용");
  if (error) throw new Error(error);
  console.log(data);
  currentUser.value = data[0];
  console.log(currentUser.value);

  try {
    const { data, error } = await supabase.from("userinfo").select().eq("nickname", userNickName);
    if (error) throw new Error("유저 정보 불러오기 실패" + error);

    userData.value = data[0];
    console.log(userData.value);

    // 모임 게시글 불러오기
    const filterMeetingId = userData.value.posts.filter((postInfo) => {
      const info = JSON.parse(postInfo);
      return info.type !== "lounge_posts";
    });
    console.log(filterMeetingId);

    const meeting = filterMeetingId.map(async (meetingId) => {
      const info = JSON.parse(meetingId);
      const { data, error } = await supabase.from(`${info.type}`).select().eq("id", info.id);
      if (error) throw new Error("모임 게시글 정보 불러오기 실패", error);
      return data[0];
    });

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
});

const shortDesc = computed(() => {
  const desc = userData.value?.description || "";

  if (desc.length >= 40 && !moreDesc.value) {
    return desc.slice(0, 38) + "...";
  } else {
    return desc;
  }
});
const moreDesc = ref(false);

const toggleFollow = async (userId) => {
  if (!currentUser.value) {
    alert("로그인이 필요합니다.");
    return;
  }

  const isFollowing = currentUser.value.following?.includes(userId);
  let updatedFollowing = currentUser.value.following || [];

  if (isFollowing) {
    updatedFollowing = updatedFollowing.filter((id) => id !== userId);
  } else {
    updatedFollowing.push(userId);
  }

  const { data, error } = await supabase
    .from("userinfo")
    .update({ following: updatedFollowing })
    .eq("id", currentUser.value.id)
    .select();
  console.log(data);
  if (error) {
    console.error("Failed to update following list:", error.message);
    return;
  }

  currentUser.value.following = updatedFollowing;
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
        v-if="userData?.profile_img"
        :src="userData.profile_img"
        alt="프로필 사진"
        class="w-[75px] h-[75px] rounded-full"
      />
      <div v-else class="w-[75px] h-[75px] rounded-full bg-white border"></div>
      <h1 class="font-extrabold text-[18px] my-3">{{ userData?.nickname }}</h1>
      <p class="w-[350px] text-[#383535] break-words">
        {{ shortDesc }}
      </p>
      <p
        class="text-[#b9b6b6] hover:underline cursor-pointer"
        v-if="userData?.description?.length >= 41 && !moreDesc"
        @click="moreDesc = true"
      >
        ...더보기
      </p>
    </div>

    <!-- 마이페이지 (로그인한 유저) -->
    <div v-if="isMyPage" class="flex justify-center gap-8 my-10">
      <button type="button" class="text-[14px] border w-[170px] h-[40px] rounded-[10px]">프로필 변경</button>
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
      <button
        v-else
        type="button"
        class="bg-[#F43630] text-white w-[65px] h-[30px] rounded-[25px]"
        @click="toggleFollow(userData.id)"
      >
        팔로우
      </button>
    </div>

    <!-- 피드 정보 -->
    <div class="mt-10">
      <ul class="h-[45px] flex">
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
      <div class="flex flex-wrap" v-if="feedNav === '피드'">
        <UserInfoFeed v-if="userFeedPosts.length > 0" v-for="userFeedPost in userFeedPosts" :feed-data="userFeedPost" />
      </div>
      <div v-else-if="feedNav === '모임'" class="px-4">
        <UserInfoMeeting :meeting-data="userMeetingPosts" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
