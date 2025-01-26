import supabase from "@/config/supabase";

// 소셜링 게시글 좋아요 함수
export const joinClub = async (postInfo, userId) => {
  try {
    // 내가 좋아요를 한 게시글인지 확인
    const currentParticipants = postInfo.participants || [];
    const isJoin = currentParticipants.includes(userId);

    const updateParticipants = isJoin
      ? currentParticipants.filter((participant) => participant !== userId)
      : [...currentParticipants, userId];

    const { data, error } = await supabase
      .from("club_posts")
      .update({ participants: updateParticipants })
      .eq("id", postInfo.id)
      .select();

    console.log(data);
    if (error) console.log(isJoin ? "참여하기 취소 오류" : "참여하기 오류!", error);
    return data;
  } catch (error) {
    console.error(error);
  }
};
