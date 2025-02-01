import supabase from "@/config/supabase";

export const channelLike = async (post, userId, tableName) => {
  try {
    const { data: userData, error: userDataError } = await supabase
      .from("userinfo")
      .select("postLikes")
      .eq("id", userId)
      .single();

    if (userDataError) {
      console.error(userDataError);
      return;
    }

    const isPostData = userData?.postLikes.some((data) => {
      const info = JSON.parse(data);
      return info.id === post.id;
    });

    let currentLikes = post.likes || 0;

    if (isPostData) {
      const unlike = currentLikes - 1;
      await updateLikes(post.id, unlike, tableName);
      await updateUserData(post.id, userId, tableName);
      post.likes = unlike;
      console.log("좋아요 취소");
      return;
    }
    const like = currentLikes + 1;
    await updateLikes(post.id, like, tableName);
    await updateUserData(post.id, userId, tableName);
    post.likes = like;
    console.log("좋아요");
  } catch (error) {
    console.error("channelLike error", error);
  }
};

const updateLikes = async (postId, likes, tableName) => {
  try {
    const { data, error } = await supabase.from(tableName).update({ likes }).eq("id", postId).select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in updateLikes:", error);
    throw error;
  }
};

const updateUserData = async (postId, userId, tableName) => {
  const { data: userData, error: userDataError } = await supabase
    .from("userinfo")
    .select("postLikes")
    .eq("id", userId)
    .single();

  if (userDataError) {
    console.error(userDataError);
    return;
  }
  // 유저DB 업데이트 정보

  // 좋아요가 있는지 없는지 확인
  const isPostData = userData?.postLikes.some((data) => {
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
    updatePostLikes = [...userData.postLikes, JSON.stringify({ id: postId, type: tableName })];
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
