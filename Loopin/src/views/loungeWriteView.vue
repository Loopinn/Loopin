<script setup>
import supabase from "@/config/supabase";
import { computed, onBeforeMount, ref, watch } from "vue";
import { usePostStore } from "@/stores/postStore";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import FeedModal from "@/components/lounge/FeedModal.vue";
import arrow from "@/assets/images/arrow-right.svg";
import addImage from "@/assets/images/addImages.svg";
import paper from "@/assets/images/paper.svg";
import Loading from "@/components/Loading.vue";

const router = useRouter();
const route = useRoute();

const postStore = usePostStore();
const { loungePosts } = storeToRefs(postStore);
const { loadLoungePosts, createLoungePost } = postStore;

const isModalOpen = ref(false);
const isLoading = ref(false);

const selectedItem = ref(null);
const selectedImage = ref([]);
const fileInput = ref(null);

const category = ref("");
const title = ref("test");
const description = ref("");
const creator = ref("");
const images = ref([]);

// 수정화면 로직
const postId = ref(route.params.id);
console.log("postId", postId.value);
const currentPost = computed(() => {
    if (postId.value) {
        const post = loungePosts.value.find((post) => post.id === postId.value);
        if (post) {
            description.value = post.description;
            selectedImage.value = post.images;  
            return post;
        }
    }
    return null;
});

watch(selectedItem, (newValue) => {
  category.value = newValue;
});

// 파일 선택 후 이미지 미리보기
function handleFileChange(event) {
  const files = event.target.files;
  const fileArray = Array.from(files);
  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (selectedImage.value.length < 10) {
        selectedImage.value.push(e.target.result);
        images.value = Array.from(files);
      } else {
        alert("최대 10개의 이미지만 첨부할 수 있습니다.");
        return;
      }
    };
    reader.readAsDataURL(file);
  });
}
function triggerFileInput() {
  fileInput.value.click();
}
function openModal() {
  isModalOpen.value = true;
}
function handleSelect(item) {
  selectedItem.value = item;
}
function removeImage(index) {
  selectedImage.value.splice(index, 1);
  images.value.splice(index, 1);
}

// 피드 등록
const handleSubmit = async () => {
  if (postId.value) {
    alert("공사중🚧");
    return false;
  }
  isLoading.value = true;

  if (!images.value) {
    return alert("이미지를 선택해야합니다.");
  }
  if (category.value && description.value && creator.value) {
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
    const submitResponse = await createLoungePost(
      {
        title: title.value,
        description: description.value,
        images: imageUrls,
        category: category.value,
      },
      creator.value,
    );

    if (submitResponse && submitResponse.length > 0) {
      alert("피드 등록에 성공했습니다.");
        router.push(`/lounge/${submitResponse[0].id}`);
    } else {
        alert("피드 등록에 실패했습니다.");
    }

  } else {
    isLoading.value = false;
    if (!category.value) {
      return alert("카테고리를 선택해 주세요.");
    }

    if (!description.value) {
      return alert("설명을 채워주세요.");
    }
  }
};

onBeforeMount(async () => {
  await loadLoungePosts();
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = !!data.session;
  const userId = data?.session?.user?.id;
  creator.value = isLoggedIn ? userId : "";
  console.log("creator", creator.value);
});

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="px-5 pt-6">
      <Loading v-if="isLoading" />
      <div class="relative flex items-center">
        <h1 class="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">피드 쓰기</h1>
        <button type="submit" class="ml-auto text-red-500">{{ postId ? "수정하기" : "올리기" }}</button>
      </div>
      <div class="border-t mt-4 pt-4 h-full">
        <div class="flex justify-between items-center space-x-2 cursor-pointer" @click="openModal">
          <div class="flex items-center space-x-2">
            <img :src="paper" alt="paper" class="w-6 h-6" />
            <span class="text-gray-500">{{ currentPost || selectedItem ? selectedItem || currentPost.category : "주제 선택" }}</span>
            <input type="hidden" v-model="category" />
          </div>
          <img :src="arrow" alt="arrow" class="w-4 h-4" />
        </div>
        <div class="mt-4 border-t pt-5">
          <div class="flex items-center space-x-2">
            <div
              class="border rounded-lg flex flex-col items-center justify-center w-[128px] h-[128px] overflow-hidden shrink-0"
            >
              <img
                :src="addImage"
                alt="addImage"
                class="w-[64px] h-[64px] cursor-pointer ml-3"
                @click="triggerFileInput"
              />
              <input
                type="file"
                id="file"
                accept="image/*"
                class="hidden"
                ref="fileInput"
                multiple
                @change="handleFileChange"
              />
              <div class="text-sm text-gray-500">{{ selectedImage.length }}/10</div>
            </div>

            <div class="flex overflow-x-auto space-x-2 slide-container">
              <div
                v-for="(image, index) in selectedImage"
                :key="index"
                class="flex-shrink-0 w-[128px] h-[128px] relative"
              >
                <img :src="image" alt="Selected Image" class="w-full h-full object-cover border rounded-lg" />
                <button
                  type="button"
                  @click.stop="removeImage(index)"
                  class="absolute top-2 right-2 bg-black bg-opacity-30 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <span class="text-xl">&times;</span>
                </button>
              </div>
            </div>
          </div>
          <textarea
            v-model="description"
            class="mt-4 text-gray-500 w-full resize-none outline-none h-[200px]"
             :placeholder="currentPost?.description ? '' : '오늘 어떤 것을 보고, 느끼고, 생각하셨나요?'"
          >{{ currentPost ? currentPost?.description : '' }}</textarea>
        </div>
      </div>
    </div>
  </form>
  <FeedModal v-if="isModalOpen" :isModalOpen="isModalOpen" @close="isModalOpen = false" @select="handleSelect" />
</template>

<style scoped>
textarea {
  resize: none;
  outline: none;
}

textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: #ffffff00;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
</style>
