import supabase from "@/config/supabase";

export const feedLike = async (post, userId) => {
  try {
    const currentLikes = post.likes || [];
    if (currentLikes.includes(userId)) {
      await updateLikes(
        post.id,
        currentLikes.filter((like) => like !== userId),
      );
      console.log("좋아요 취소");
      return;
    }

    await updateLikes(post.id, [...currentLikes, userId]);
    console.log("좋아요");
  } catch (error) {
    console.error(error);
  }
};

const updateLikes = async (postId, likes) => {
  try {
    const { data, error } = await supabase.from("lounge_posts").update({ likes }).eq("id", postId).select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in updateLikes:", error);
    throw error;
  }
};
