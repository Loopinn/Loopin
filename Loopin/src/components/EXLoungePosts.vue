<!-- 임시 컴포넌트 입니다 나중에 삭제 예정 -->

<script setup>
import supabase from "@/config/supabase";
import { usePostStore } from "@/stores/postStore";
import { login } from "@/utils/auth/login";
import { onBeforeMount, ref } from "vue";
import { loungeComment } from "@/utils/loungeComment";
import { storeToRefs } from "pinia";
import { feedLike } from "@/utils/feedLike";
const postStore = usePostStore();
const { createLoungePost, loadLoungePosts, deleteLoungePost } = postStore;
const { loungePosts } = storeToRefs(postStore);

const title = ref("");
const description = ref("");
const creator = ref("91021736-14c0-4b73-a92f-89429ca7a65d");
const images = ref(null);

const uemail = ref("");
const upassword = ref("");

const comment = ref("");

onBeforeMount(() => {
  loadLoungePosts();
  console.log("loungePosts", loungePosts);
});

const handleImages = (e) => {
  const files = e.target.files;
  console.log(files);
  if (files) {
    images.value = Array.from(files);
    console.log(images.value);
  } else {
    images.value = null;
  }
};

// 라운지 피드 등록 함수
const handleSubmit = async () => {
  if (!images.value) {
    return alert("이미지를 선택해야합니다.");
  }

  if (title.value && description.value && creator.value) {
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

    const submitResponse = await createLoungePost(
      {
        title: title.value,
        description: description.value,
        creator: creator.value,
        images: imageUrls,
      },
      "91021736-14c0-4b73-a92f-89429ca7a65d",
    );
    console.log("done", submitResponse);
  } else {
    return alert("빈칸을 채워주세");
  }
};

// const handleLike = async (post) => {
//   try {
//     const currentLikes = post.likes || [];

//     // 2번째 로그인 한 유저의 id로 변경해야됨
//     const updateLikes = [...currentLikes, creator.value];
//     const response = await supabase.from("lounge_posts").update({ likes: updateLikes }).eq("id", post.id).select();

//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// };
</script>
<template>
  <h1>lounge post</h1>
  <!-- 임시 로그인 -->
  <form @submit.prevent="login(uemail, upassword)">
    <input type="email" v-model="uemail" placeholder="이메일" />
    <input type="password" v-model="upassword" placeholder="비밀번호" />
    <button>submut</button>
  </form>

  <form @submit.prevent="handleSubmit">
    <div class="flex items-center space-x-2">
      <label for="title" class="text-sm w-24">제목</label>
      <input type="text" id="title" v-model="title" class="border p-2 rounded flex-1" />
    </div>
    <div class="flex items-center space-x-2">
      <label for="description" class="text-sm w-24">내용</label>
      <textarea type="text" id="description" v-model="description" class="border p-2 rounded flex-1" />
    </div>
    <div class="flex items-center space-x-2">
      <label for="file" class="text-sm w-24">file</label>
      <input type="file" id="file" accept="image/*" @change="handleImages" class="border p-2 rounded flex-1" multiple />
    </div>
    <button type="submit" class="bg-blue-500 text-white p-2 rounded">등록</button>
  </form>

  <form
    @submit.prevent="
      loungeComment({ comment: comment, post_id: '9c4ab856-c8fb-47b7-b14a-6b24bc526202', creator: creator })
    "
  >
    <input type="text" v-model="comment" />
    <button>comment</button>
  </form>
  <div>
    <div v-for="post in loungePosts" :key="post.id">
      <h1>{{ post.title }}</h1>
      <p>{{ post.description }}</p>
      <p>{{ post.creator }}</p>

      <img v-for="image in post.images" :src="image" alt="이미지" class="w-[100px]" />
      <p>{{ post.created_at }}</p>

      <button class="border border-red-700 text-red-600" type="button" @click="feedLike(post, creator)">like</button>
    </div>
  </div>
</template>
<style scoped></style>
