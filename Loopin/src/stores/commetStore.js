import supabase from "@/config/supabase";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useCommentStore = defineStore("commentStore", () => {
  const challengeComments = reactive({});
  const loungeComments = ref([]);
  const socialComments = ref([]);

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

  // 라운지 피드
  const loadLoungeComments = async (postId) => {
    try {
      const { data, error } = await supabase.from("lounge_comments").select("*").eq("post_id", postId).order("created_at", { ascending: false });

      console.log("lounge", data);
      loungeComments.value = data;
      console.log("loungeComments", loungeComments.value);
    } catch (error) {
      console.error(error);
    }
  };

  const createLoungeComment = async (commentInfo) => {
    try {
      const { data: commentData, error: commentError } = await supabase
        .from("lounge_comments")
        .insert({ ...commentInfo })
        .select();
      if (commentError) throw new Error(commentError);
      console.log("댓글 달기 성공", commentData);

      // 피드 정보 가져옴
      const { data: feedData, error: feedError } = await supabase
        .from("lounge_posts")
        .select("comments")
        .eq("id", commentData[0].post_id)
        .single();

      const currentComments = feedData.comments || [];
      const updateComments = [...currentComments, commentData[0].id];
      // 피드 DB에 댓글 추가
      const response = await supabase
        .from("lounge_posts")
        .update({ comments: updateComments })
        .eq("id", commentData[0].post_id)
        .select();

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLoungeComment = async (postInfo, commentId) => {
    try {
      if (!postInfo.comments || !postInfo.comments.length) return;

      const currentComments = postInfo.comments;
      const deletedComments = currentComments.filter((curComment) => curComment !== commentId);
      const deletedCommentsd = [...deletedComments];
      const response = await supabase.from("lounge_comments").delete().eq("id", commentId).select();
      console.log("삭제완료!", response);

      const { data, error } = await supabase
        .from("lounge_posts")
        .update({ comments: deletedCommentsd })
        .eq("id", postInfo.id);
      if (error) console.error(error);
      console.log("게시판에 있는 댓글 내역도 삭제완료!", data);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const updateLoungeComment = async (newComment, commentId) => {
    try {
      const response = await supabase.from("lounge_comments").update({ comment: newComment }).eq("id", commentId);

      console.log("수정완료!", response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const loungeCommentLike = async (commentInfo, userId) => {
    try {
      const currentLikes = commentInfo.likes || [];
      const updatedLikes = [...currentLikes, userId];

      const { data, error } = await supabase
        .from("lounge_comments")
        .update({ likes: updatedLikes })
        .eq("id", commentInfo.id)
        .select();
      if (error) throw new Error("댓글 좋아요 추가 오류!", error);
      console.log("댓글 좋아요 추가 완료!", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const loungeCommentUnLike = async (commentInfo, userId) => {
    try {
      if (!commentInfo.likes || !commentInfo.likes.length) return;

      const currentLikes = commentInfo.likes;
      const updatedLikes = currentLikes.filter((like) => like !== userId);
      const { data, error } = await supabase
        .from("lounge_comments")
        .update({ likes: updatedLikes })
        .eq("id", commentInfo.id)
        .select();

      if (error) throw new Error("댓글 좋아요 취소 오류!", error);
      console.log("댓글 좋아요 취소 완료!", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // 소셜링 댓글
  const loadSocialComments = async (postId) => {
    try {
      const { data: commentData, error: socialCommentsError } = await supabase
        .from("socialing_comments")
        .select("*")
        .eq("post_id", postId)
        .select();

      console.log("소셜링 댓글 불러옴", commentData);
      if (socialCommentsError) throw new Error("소셜링 댓글 볼러오기 실패", socialCommentsError);

      socialComments.value = commentData;
    } catch (error) {
      console.error(error);
    }
  };

  const createSocialComment = async (commentInfo) => {
    try {
      const { data: commentData, error: commentError } = await supabase
        .from("socialing_comments")
        .insert({ ...commentInfo })
        .select();
      if (commentError) throw new Error(commentError);
      console.log("댓글 달기 성공", commentData);

      // 피드 정보 가져옴
      const { data: socialData, error: feedError } = await supabase
        .from("socialing_posts")
        .select("comments")
        .eq("id", commentData[0].post_id)
        .single();

      const currentComments = socialData.comments || [];
      const updateComments = [...currentComments, commentData[0].id];
      // 피드 DB에 댓글 추가
      const response = await supabase
        .from("socialing_posts")
        .update({ comments: updateComments })
        .eq("id", commentData[0].post_id)
        .select();

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSocialComment = async (postInfo, commentId) => {
    try {
      if (!postInfo.comments || !postInfo.comments.length) return;

      const currentComments = postInfo.comments;
      const deletedComments = currentComments.filter((curComment) => curComment !== commentId);
      const response = await supabase.from("socialing_comments").delete().eq("id", commentId).select();
      console.log("삭제완료!", response);

      const { data, error } = await supabase
        .from("socialing_posts")
        .update({ comments: deletedComments })
        .eq("id", postInfo.id);
      if (error) console.error(error);
      console.log("게시판에 있는 댓글 내역도 삭제완료!", data);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const updateSocialComment = async (newCommentInfo, commentId) => {
    try {
      const response = await supabase
        .from("socialing_comments")
        .update({ comment: newCommentInfo })
        .eq("id", commentId);

      console.log("수정완료!", response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const socialCommentLike = async (commentInfo, userId) => {
    try {
      const currentLikes = commentInfo.likes || [];
      const updatedLikes = [...currentLikes, userId];

      const { data, error } = await supabase
        .from("socialing_comments")
        .update({ likes: updatedLikes })
        .eq("id", commentInfo.id)
        .select();
      if (error) throw new Error("댓글 좋아요 추가 오류!", error);
      console.log("댓글 좋아요 추가 완료!", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const socialCommentUnLike = async (commentInfo, userId) => {
    try {
      if (!commentInfo.likes || !commentInfo.likes.length) return;

      const currentLikes = commentInfo.likes;
      const updatedLikes = currentLikes.filter((like) => like !== userId);
      const { data, error } = await supabase
        .from("socialing_comments")
        .update({ likes: updatedLikes })
        .eq("id", commentInfo.id)
        .select();

      if (error) throw new Error("댓글 좋아요 취소 오류!", error);
      console.log("댓글 좋아요 취소 완료!", data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    challengeComments,
    loadChallengeComments,
    createChallengeComment,
    deleteChallengeComment,
    updateChallengeComment,
    loungeComments,
    loadLoungeComments,
    createLoungeComment,
    deleteLoungeComment,
    updateLoungeComment,
    loungeCommentLike,
    loungeCommentUnLike,
    socialComments,
    loadSocialComments,
    createSocialComment,
    deleteSocialComment,
    updateSocialComment,
    socialCommentLike,
    socialCommentUnLike,
  };
});
