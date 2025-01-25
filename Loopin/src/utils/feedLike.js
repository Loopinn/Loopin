import supabase from "@/config/supabase";

export const feedLike = async (post, userId) => {
  try {
    const currentLikes = post.likes || [];

    if (currentLikes.includes(userId)) {
      await updateLikes(
        post.id,
        currentLikes.filter((like) => like !== userId),
      );
      await updateUserData(post.id, userId);
      console.log("좋아요 취소");
      return;
    }

    await updateLikes(post.id, [...currentLikes, userId]);

    await updateUserData(post.id, userId);
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

const updateUserData = async (postId, userId) => {
  const { data: userData, error: userDataError } = await supabase
    .from("userinfo")
    .select("postLikes")
    .eq("id", userId)
    .single();

  if (userDataError) {
    console.error(userDataError);
  }

  // 유저DB 업데이트 정보

  // 좋아요가 있는지 없는지 확인
  const isPostData = userData.postLikes.some((data) => {
    const info = JSON.parse(data);
    return info.id === postId;
  });

  let updatePostLikes;
  if (isPostData) {
    updatePostLikes = userData.postLikes.filter((data) => {
      const likedata = JSON.parse(data);
      return likedata.id !== postId;
    });
  } else {
    updatePostLikes = [...userData.postLikes, { id: postId, type: "lounge_posts" }];
  }

  if (!updatePostLikes) return;

  const { data: userUpdateData, error: userUpdateError } = await supabase
    .from("userinfo")
    .update({ postLikes: updatePostLikes })
    .eq("id", userId)
    .select();

  if (userUpdateError) {
    console.error(userUpdateError);
  }
  console.log(userUpdateData);
};
