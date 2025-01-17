import supabase from "@/config/supabase";

// 소셜링 게시글 좋아요 함수
export const socialLike = async (postInfo, userId) => {
  try {
    // 내가 좋아요를 한 게시글인지 확인
    const currentLike = postInfo.likes || [];
    const isLike = currentLike.includes(userId);

    const updateLike = isLike ? currentLike.filter((likeId) => likeId !== userId) : [...currentLike, userId];

    const { data: likeResult, error: likeError } = await supabase
      .from("socialing_posts")
      .update({ likes: updateLike })
      .eq("id", postInfo.id)
      .select();

    console.log(likeResult);
    if (likeError) console.log(isLike ? "좋아요 취소 오류" : "좋아요 오류!", likeError);
    return likeResult;
  } catch (error) {
    console.error(error);
  }
};
