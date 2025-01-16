import supabase from "@/config/supabase";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useCommentStore = defineStore("commentStore", () => {
  const challengeComments = reactive({});

  const loadChallengeComments = async (postId) => {
    if (!challengeComments[postId]) {
      // 댓글이 로드되지 않았을 경우만 요청
      const { data, error } = await supabase.from("challenge_comments").select("*").eq("post_id", postId); // postId로 필터링

      if (error) {
        console.error("Error loading comments:", error.message);
        return;
      }

      challengeComments[postId] = data || []; // 댓글 저장
      subscribeChallengeComments(postId);
    }
  };
  const subscribeChallengeComments = (postId) => {
    supabase
      .channel(`challenge-comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "challenge_comments", filter: `post_id=eq.${postId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            challengeComments[postId].push(payload.new);
          }
          if (payload.eventType === "DELETE") {
            // 댓글 삭제
            const index = challengeComments[postId].findIndex((comment) => comment.id === payload.old.id);
            if (index !== -1) {
              challengeComments[postId].splice(index, 1);
            }
          }
          if (payload.eventType === "UPDATE") {
            // 댓글 업데이트
            const index = challengeComments[postId].findIndex((comment) => comment.id === payload.new.id);
            if (index !== -1) {
              Object.assign(challengeComments[postId][index], payload.new);
            }
          }
        },
      )
      .subscribe();
  };

  const createChallengeComment = async (createCommentForm) => {
    const newComment = Object.assign({}, createCommentForm);

    const { error } = await supabase.from("challenge_comments").insert([newComment]).select();
    if (error) {
      //오류 발생 시 로직
      console.log(error);
    }
  };

  return {
    challengeComments,
    loadChallengeComments,
    createChallengeComment,
  };
});
