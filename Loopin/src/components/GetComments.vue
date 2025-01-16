<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCommentStore } from "@/stores/commetStore";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});
const commentStore = useCommentStore();
const { challengeComments } = storeToRefs(commentStore);
const { loadChallengeComments, createChallengeComment } = commentStore;

const inputText = ref("");

// 해당 게시글의 댓글만 가져오기
const comments = computed(() => challengeComments.value[props.postId] || []);

const handleSubmit = () => {
  createChallengeComment({ post_id: props.postId, content: inputText.value });
};

onMounted(() => {
  loadChallengeComments(props.postId); // postId로 댓글 로드
});
</script>
<template>
  <div>
    <h3>Comments</h3>
    <form @submit.prevent="handleSubmit">
      <input v-model="inputText" type="text" class="border" />
      <button type="submit">submit</button>
    </form>
    <ul v-if="comments.length">
      <li v-for="comment in comments" :key="comment.id">
        {{ comment.content }}
      </li>
    </ul>
    <p v-else>No comments yet.</p>
  </div>
</template>
<style scoped></style>
