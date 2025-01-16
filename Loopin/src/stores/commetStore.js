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
    // INSERT 이벤트에 필터 적용
    supabase
      .channel(`challenge-comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "challenge_comments", filter: `post_id=eq.${postId}` },
        (payload) => {
          console.log(payload);
          challengeComments[postId].push(payload.new); // 새 댓글 추가
        },
      )
      // UPDATE 이벤트에 필터 적용
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "challenge_comments", filter: `post_id=eq.${postId}` },
        (payload) => {
          console.log(payload);
          const index = challengeComments[postId].findIndex((comment) => comment.id === payload.new.id);
          if (index !== -1) {
            Object.assign(challengeComments[postId][index], payload.new); // 댓글 업데이트
          }
        },
      )
      .subscribe();

    // DELETE 이벤트는 filter 없이 구독
    supabase
      .channel(`challenge-comments-delete-${postId}`)
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "challenge_comments" }, // filter 없이
        (payload) => {
          console.log(payload);
          const index = challengeComments[postId].findIndex((comment) => comment.id === payload.old.id);
          if (index !== -1) {
            challengeComments[postId].splice(index, 1); // 댓글 삭제
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
  const deleteChallengeComment = async (commentId) => {
    const { error } = await supabase.from("challenge_comments").delete().eq("id", commentId);
    if (error) {
      //오류 발생 시 로직
      console.log(error);
    }
  };

  const updateChallengeComment = async (postId, commentId, updates) => {
    const index = challengeComments[postId].findIndex((comment) => comment.id === commentId);
    if (index === -1) {
      console.log("Comment not found.");
      return;
    }
    //반응형으로 복사히지 않기 위해//useNonReactiveCopy훅으로 빼기
    const oldComment = JSON.parse(JSON.stringify(challengeComments[postId][index]));

    Object.assign(challengeComments[postId][index], updates);

    const { error } = await supabase.from("challenge_comments").update(updates).eq("id", commentId).select();
    if (error) {
      console.log("failed to update", error);
      Object.assign(challengeComments[postId][index], oldComment);
    }
  };

  return {
    challengeComments,
    loadChallengeComments,
    createChallengeComment,
    deleteChallengeComment,
    updateChallengeComment,
  };
});
