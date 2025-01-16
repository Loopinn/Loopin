import supabase from "@/config/supabase";

export const loungeComment = async (commentInfo) => {
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
