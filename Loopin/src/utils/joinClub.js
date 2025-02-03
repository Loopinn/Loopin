import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const { updateUser } = authStore;

// 클럽 게시글 참여하기 함수
export const joinClub = async (postInfo, userId) => {
  try {
    // 내가 참여한 게시글인지 확인
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


    if (error) console.log(isJoin ? "참여하기 취소 오류" : "참여하기 오류!", error);

    // 유저 DB 업데이트
    const { data: userData, error: userError } = await supabase.from("userinfo").select().eq("id", userId).single();

    const currentUserJoinPosts = userData.joinPosts;

    const updateJoinClub = isJoin
      ? currentUserJoinPosts.filter((joinPost) => {
          const joinPostData = JSON.parse(joinPost);
          return joinPostData.id !== postInfo.id;
        })
      : [...currentUserJoinPosts, { id: postInfo.id, type: "club_posts" }];



    const { data: userJoinPost, error: userJoinPostError } = await supabase
      .from("userinfo")
      .update({ joinPosts: updateJoinClub })
      .eq("id", userId)
      .select()
      .single();

    if (userJoinPostError) {
      console.error(userJoinPost);
    }

    updateUser(userJoinPost);

    return data;
  } catch (error) {
    console.error(error);
  }
};
