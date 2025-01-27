<script setup>
import MemberInfo from "@/components/postcontent/MemberInfo.vue";
import Comment from "@/components/postcontent/Comment.vue";
import Register from "@/components/postcontent/Register.vue";
import { joinClub } from "@/utils/joinClub";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import supabase from "@/config/supabase";
import { useRoute } from "vue-router";
import { ref, computed, onBeforeMount, onMounted, watchEffect } from "vue";
import MoreModal from "@/components/lounge/MoreModal.vue";

const postStore = usePostStore();
const { clubPosts } = storeToRefs(postStore);
const { loadClubPosts } = postStore;

const route = useRoute();
const postId = route.params.id;

const userData = ref(null);
const userId = ref("");
const isLoading = ref(false);

const isModalOpen = ref(false);

const getUserId = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("내 아이디: ", sessionData?.session?.user?.id);
  userId.value = sessionData?.session?.user?.id || "";
};

const currentPost = computed(() => {
  return clubPosts.value.find((post) => post.id === postId);
});

const addressName = computed(() => {
  if (currentPost.value?.place === "온라인") {
    return "온라인";
  }
  const placeObj = currentPost.value?.place ? JSON.parse(currentPost.value.place) : null;
  return placeObj.address_name;
});

const fetchData = async () => {
  isLoading.value = true;
  if (currentPost.value && currentPost.value.creator) {
    try {
      // Supabase에서 작성자 정보 가져오기
      const { data: userDataFromDB, error: userError } = await supabase
        .from("userinfo")
        .select()
        .eq("id", currentPost.value.creator)
        .single();

      if (userError) {
        console.log("유저 데이터를 가져오는 중 에러 발생", userError);
        return;
      }

      if (userDataFromDB) {
        userData.value = userDataFromDB;
      }
    } catch (error) {
      console.log("알 수 없는 오류 발생: ", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    console.log("작성자 ID가 없습니다.");
  }
};

const handleUpdateParticipants = (updatedParticipants) => {
  currentPost.value.participants = updatedParticipants;
};

const openModal = () => {
  isModalOpen.value = true;
};

onMounted(async () => {
  console.log("현재 게시글", currentPost.value);
  await getUserId();
});

// currentPost가 변경될 때마다 자동으로 실행
watchEffect(() => {
  if (currentPost.value && currentPost.value?.creator) {
    fetchData();
  }
});

onBeforeMount(() => {
  loadClubPosts();
});
</script>
<template>
  <div v-if="currentPost" class="mx-auto w-[600px] relative">
    <MoreModal :isModalOpen="isModalOpen" :postId="postId" @close="isModalOpen = false" />
    <img class="w-full h-[260px] object-cover" :src="currentPost.images ? currentPost.images[0] : ''" alt="thumbnail" />
    <div class="bg-[#f1f1f1] min-h-screen pb-[120px] pt-11">
      <div class="ml-[40px] w-[520px]">
        <div v-if="userData" class="h-[80px] flex gap-4 relative">
          <div class="flex-shrink-0">
            <img
              v-if="userData.profile_img"
              :src="userData.profile_img"
              alt="hostprofile"
              class="w-[60px] h-[60px] rounded-full"
            />
            <img v-else src="@/assets/images/no-profile.svg" alt="hostprofile" class="w-[60px] h-[60px] rounded-full" />
            <div>
              <img src="@/assets/images/members_gray.svg" alt="memberscount" class="inline-block" />
              <span class="ml-1 text-[12px] text-[#403F3F]"
                >{{ currentPost.participants ? currentPost.participants.length : 0 }}/{{
                  currentPost.max_people
                }}명</span
              >
            </div>
          </div>
          <div class="mt-1 flex flex-col justify-center">
            <p class="text-[20px] font-bold mb-1">{{ currentPost.title }}</p>
            <p class="text-[12px]">
              호스트 <b>{{ userData.nickname }}</b>
            </p>
          </div>
          <div class="flex items-center gap-2 absolute right-0">
            <button @click="openModal"><img src="@/assets/images/more-black.svg" alt="더보기" /></button>
          </div>
        </div>

        <div class="mt-[30px]">
          <div>{{ currentPost.description }}</div>
          <!-- 멤버 소개 -->
          <MemberInfo :participants="currentPost.participants || []" />
          <!-- 안내사항 -->
          <div class="mt-5">
            <div class="text-[#FF0000]">안내사항</div>
            <div class="font-bold">자세한 정보를 알려드릴게요</div>
            <div class="mt-2">
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/category.svg" alt="category" />

                <router-link to="#" class="underline">{{ currentPost.subject }}</router-link>
                <span v-if="currentPost.subject"> > </span>
                <router-link to="#" class="underline">{{ currentPost.category }}</router-link>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/members.svg" alt="members" />
                <p>{{ currentPost.max_people }}명</p>
              </div>
              <div class="flex gap-1 mb-1">
                <img src="@/assets/images/location.svg" alt="location" />
                <p>{{ addressName }}</p>
              </div>
            </div>
          </div>
          <!-- 댓글 -->
          <Comment :likes="currentPost.likes" :comments="currentPost.comments" />
        </div>
      </div>
    </div>

    <!-- 참여하기 -->
    <Register
      :title="currentPost.title"
      :currentPost="currentPost"
      :pageType="'club'"
      :userId="userId"
      :action="joinClub"
      @updateParticipants="handleUpdateParticipants"
    />
  </div>
</template>
<style scoped></style>
