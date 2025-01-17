<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commetStore";
import userProfile from "@/assets/images/defaultprofile30.svg";
import commentsbutton from "@/assets/images/comments-button.svg";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});
const commentStore = useCommentStore();
const { challengeComments } = storeToRefs(commentStore);
const { loadChallengeComments, createChallengeComment, deleteChallengeComment, updateChallengeComment } = commentStore;

const inputText = ref("");

// 해당 게시글의 댓글만 가져오기
const comments = computed(() => challengeComments.value[props.postId] || []);

const handleSubmit = () => {
  createChallengeComment({ post_id: props.postId, content: inputText.value });
};
const handleDelete = (commentId) => {
  deleteChallengeComment(commentId);
};
const handleUpdate = (commentId) => {
  updateChallengeComment(props.postId, commentId, { content: "updated" });
};

onMounted(() => {
  loadChallengeComments(props.postId); // postId로 댓글 로드
  console.log("postId",props.postId);
  console.log("comments",comments);
});


// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

</script>
<template>
  <div class="p-4 bg-white rounded-b-lg">
    <form @submit.prevent="handleSubmit" class="flex items-center gap-2 mb-4  p-3 rounded">
      <div class="relative inline-block">
        <div class="absolute inset-0 w-10 h-10 bg-gray-700 rounded-full -z-10"></div>
        <img :src="userProfile" alt="유저 아이콘" class="w-8 h-8 mr-2" />
      </div>
      <input 
        v-model="inputText" 
        type="text" 
        class="bg-transparent border-none flex-1 " 
        placeholder="댓글 달기..." 
      />
      <button type="submit" class="bg-gray-400 text-white p-2 rounded-full">
        <img :src="commentsbutton" alt="전송" class="w-4 h-4" />
      </button>
    </form>
    <ul v-if="comments.length" class="space-y-4">
      <li v-for="comment in comments" :key="comment.id" class="flex items-start p-4 rounded-lg">
        <img :src="userProfile" alt="유저 아이콘" class="w-8 h-8 mr-3" />
        <div class="flex-1 flex items-start">
          <div>
            <span class="font-bold">{{ comment.creator }}</span>
            <p class="text-gray-800 mb-2 mt-3">{{ comment.content }}</p>
            <div class="flex text-[11px] text-gray-500">
              <span>{{ formatDate(comment.created_at) }}</span>
              <span class="ml-2">좋아요 {{ comment.likes || 0}}개</span>
              <span class="ml-2 text-red-600">삭제</span>
            </div>
          </div>
          <button class="ml-auto text-gray-500"><img src="../assets/images/likeblack.svg" alt="좋아요" /></button>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500">아직 댓글이 없습니다.</p>
  </div>
</template>
<style scoped></style>
