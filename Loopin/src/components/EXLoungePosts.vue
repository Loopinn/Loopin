<!-- 임시 컴포넌트 입니다 나중에 삭제 예정 -->

<script setup>
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { login } from "@/utils/auth/login";
import { computed, onBeforeMount, onMounted, ref } from "vue";

import { storeToRefs } from "pinia";
import { feedLike } from "@/utils/feedLike";
import { useCommentStore } from "@/stores/commetStore";
import { logout } from "@/utils/auth/logout";
import { socialLike } from "@/utils/socialLike";
import { joinSocialing } from "@/utils/joinSocialing";
const postStore = usePostStore();
const { createSocialPost, loadSocialPosts, deleteSocialPost, createLoungePost } = postStore;
const { socialingPosts } = storeToRefs(postStore);

const commentStore = useCommentStore();
const { socialComments } = storeToRefs(commentStore);

const { socialCommentLike, loadSocialComments, socialCommentUnLike } = commentStore;

const title = ref("");
const description = ref("");
const creator = ref("91021736-14c0-4b73-a92f-89429ca7a65d");
const images = ref(null);
const date = ref(null);

const uemail = ref("");
const upassword = ref("");

const comment = ref("");

const newComment = ref("");

onBeforeMount(() => {
  loadSocialPosts();
  loadSocialComments("97de5bfa-e485-4907-80ec-8ee5e3e04ab1");
  // loadLoungeComments("9c4ab856-c8fb-47b7-b14a-6b24bc526202");
  console.log(socialingPosts);
});

const handleImages = (e) => {
  // 다중 이미지
  const files = e.target.files;
  console.log(files);
  if (files) {
    images.value = Array.from(files);
    console.log(images.value);
  } else {
    images.value = null;
  }

  // 단일 이미지
  // const file = e.target.files[0];
  // if (file) {
  //   images.value = file;
  // } else {
  //   images.value = null;
  // }
};

// 라운지 피드 등록 함수
const handleSubmit = async () => {
  if (!images.value) {
    return alert("이미지를 선택해야합니다.");
  }

  if (title.value && description.value && creator.value) {
    // 다중 이미지
    const imageUrls = await Promise.all(
      images.value.map(async (image) => {
        const fileName = `${Date.now()}-${image.name}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from("post-images")
          .upload(`images/feed/${fileName}`, image);

        if (imageError) throw imageError;
        console.log("imageData", imageData);
        const { data: imagePath } = supabase.storage.from("post-images").getPublicUrl(`images/feed/${fileName}`);

        const imageUrl = imagePath.publicUrl;
        return imageUrl;
      }),
    );

    // const fileName = `${Date.now()}-${images.value.name}`;
    // const { data: imageData, error: imageError } = await supabase.storage
    //   .from("post-images")
    //   .upload(`images/socialing/${fileName}`, images.value);

    // if (imageError) throw new Error(imageError);

    // const { data: imagePath } = supabase.storage.from("post-images").getPublicUrl(`images/socialing/${fileName}`);
    // const imageUrl = imagePath.publicUrl;

    const submitResponse = await createLoungePost(
      // {
      //   title: title.value,
      //   description: description.value,
      //   images: imageUrl,
      //   fee: 3000,
      //   gender: "남성",
      //   max_people: 10,
      //   place: "오프라인",
      //   age_limit: 50,
      //   date: date.value,
      //   category: "재테크",
      // },
      {
        title: title.value,
        description: description.value,
        images: imageUrls,
        category: "재테크",
      },
      "91021736-14c0-4b73-a92f-89429ca7a65d",
    );
    console.log("done", submitResponse);
  } else {
    return alert("빈칸을 채워주세");
  }
};

const isParticipant = (socialingPost, userId) => {
  if (!socialingPost.participants) return false;
  return socialingPost.participants.includes(userId);
};

const isCommentLike = (commentLike, userId) => {
  if (!commentLike) return false;
  return commentLike.includes(userId);
};
</script>
<template>
  <h1>lounge post</h1>
  <!-- 임시 로그인 -->
  <form @submit.prevent="login(uemail, upassword)">
    <input type="email" v-model="uemail" placeholder="이메일" />
    <input type="password" v-model="upassword" placeholder="비밀번호" />
    <button>submut</button>
  </form>
  <button class="border" @click="logout">로그아웃</button>

  <form @submit.prevent="handleSubmit">
    <div class="flex items-center space-x-2">
      <label for="title" class="text-sm w-24">제목</label>
      <input type="text" id="title" v-model="title" class="border p-2 rounded flex-1" />
    </div>
    <div class="flex items-center space-x-2">
      <label for="description" class="text-sm w-24">내용</label>
      <textarea id="description" v-model="description" class="border p-2 rounded flex-1" />
    </div>
    <div class="flex items-center space-x-2">
      <label for="file" class="text-sm w-24">file</label>
      <input type="file" id="file" accept="image/*" @change="handleImages" class="border p-2 rounded flex-1" multiple />
    </div>
    <div class="flex items-center space-x-2">
      <label for="date" class="text-sm w-24">date</label>
      <input type="date" id="date" v-model="date" class="border p-2 rounded flex-1" />
    </div>
    <button type="submit" class="bg-blue-500 text-white p-2 rounded">등록</button>
  </form>

  <div v-for="socialingPost in socialingPosts" :key="socialingPost.id">
    <pre>{{ socialingPost }}</pre>
    <!-- <template v-if="!isParticipant(socialingPost, '91021736-14c0-4b73-a92f-89429ca7a65d')">
      <button
        type="button"
        class="bg-red-500"
        @click="joinSocialing(socialingPost, '91021736-14c0-4b73-a92f-89429ca7a65d')"
      >
        참여하기
      </button>
    </template>
    <template v-else>
      <button
        type="button"
        class="bg-red-500"
        @click="joinSocialing(socialingPost, '91021736-14c0-4b73-a92f-89429ca7a65d')"
      >
        참여 취소하기
      </button>
    </template> -->

    <!-- <form @submit.prevent="createSocialComment({ comment: comment, post_id: socialingPost.id })">
      <input type="text" v-model="comment" />
      <button>comment</button>
    </form> -->

    <!-- <button type="button" @click="deleteSocialComment(socialingPost, 'f421345f-598e-4a0b-969a-418ff5ce588c')">
      댓글 삭제
    </button> -->
  </div>
  <div v-for="socialComment in socialComments" :key="socialComment.id">
    <template v-if="!isCommentLike(socialComment.likes, '91021736-14c0-4b73-a92f-89429ca7a65d')">
      <button type="button" @click="socialCommentLike(socialComment, '91021736-14c0-4b73-a92f-89429ca7a65d')">
        좋아요
      </button>
    </template>
    <template v-else>
      <button type="button" @click="socialCommentUnLike(socialComment, '91021736-14c0-4b73-a92f-89429ca7a65d')">
        좋아요 취소
      </button>
    </template>
  </div>
</template>
<style scoped></style>
