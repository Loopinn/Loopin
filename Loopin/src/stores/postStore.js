import supabase from "@/config/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePostStore = defineStore("postStore", () => {
  const socialingPosts = ref([]);
  const clubPosts = ref([]);
  const challengePosts = ref([]);
  const loungePosts = ref([]);

  const loadClubPosts = async () => {
    let { data, error } = await supabase.from("club_posts").select("*");

    if (error) {
      //오류 발생 시 로직
      console.log(error);
    }
    if (data) {
      clubPosts.value = data;
    }
  };
  const loadChallengePosts = async () => {
    let { data, error } = await supabase.from("challenge_posts").select("*");

    if (error) {
      //오류 발생 시 로직
      console.log(error);
    }
    if (data) {
      challengePosts.value = data;
      //실시간 구독
      subscribeChallengePosts();
    }
  };

  const subscribeChallengePosts = () => {
    supabase
      .channel("challenge-posts-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "challenge_posts" }, (payload) => {
        if (payload.eventType === "INSERT") {
          challengePosts.value.push(payload.new);
        }
        if (payload.eventType === "DELETE") {
          const index = getChallengePostIndexById(payload.old.id);
          challengePosts.value.splice(index, 1);
        }
        if (payload.eventType === "UPDATE") {
          const index = getChallengePostIndexById(payload.new.id);
          Object.assign(challengePosts.value[index], payload.new);
        }
      })
      .subscribe();
  };

  const getChallengePostIndexById = (postId) => {
    return challengePosts.value.findIndex((post) => post.id === postId);
  };

  const deleteChallengePost = async (postId) => {
    const { error } = await supabase.from("challenge_posts").delete().eq("id", postId);

    if (error) {
      console.log("failed to delete", error);
    }
  };

  const createChallengePost = async (createChallengeForm) => {
    const newPost = Object.assign({}, createChallengeForm);

    const { error } = await supabase.from("challenge_posts").insert([newPost]).select();
    if (error) {
      //오류 발생 시 로직
      console.log(error);
    }
  };

  const updateChallengePost = async (postId, updates) => {
    const index = getChallengePostIndexById(postId);
    //반응형으로 복사히지 않기 위해//useNonReactiveCopy훅으로 빼기
    const oldPost = JSON.parse(JSON.stringify(challengePosts.value[index]));

    Object.assign(challengePosts.value[index], updates);

    const { error } = await supabase.from("challenge_posts").update(updates).eq("id", postId).select();
    if (error) {
      console.log("failed to update", error);
      Object.assign(challengePosts.value[index], oldPost);
    }
  };

  // 라운지 게시글
  const createLoungePost = async (postInfo, userId) => {
    try {
      const {
        data: createData,
        error: createError,
        status: createStatus,
      } = await supabase.from("lounge_posts").insert([postInfo]).select();
      console.log("생성 데이터", createData);

      if (createError && createStatus !== 201) {
        throw createError;
      }

      const postId = createData[0].id;

      // 유저 정보 가져옴
      const { data: userData, error: userError } = await supabase
        .from("userinfo")
        .select("posts")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const currentPosts = userData.posts || [];

      const updatePosts = [...currentPosts, { id: postId, type: "lounge_posts" }];

      // 유저 정보 업데이트
      const updateResponse = await supabase.from("userinfo").update({ posts: updatePosts }).eq("id", userId).select();
      console.log("updateResponse", updateResponse);

      return createData;
    } catch (error) {
      console.error(error);
    }
  };

  const loadLoungePosts = async () => {
    try {
      const { data, error } = await supabase.from("lounge_posts").select("*");
      if (error) {
        console.error(error);
      }
      console.log(data);
      loungePosts.value = data;
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLoungePost = async (postId) => {
    try {
      const response = await supabase.from("lounge_posts").delete().eq("id", postId).select();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // 소셜링
  const loadSocialPosts = async () => {
    try {
      const { data: socialData, error: socialError } = await supabase.from("socialing_posts").select();
      console.log("소셜링 게시글 정보", socialData);
      socialingPosts.value = socialData;
      console.log(socialingPosts.value);
    } catch (error) {
      console.error("loadSocialData error");
    }
  };

  const createSocialPost = async (postInfo, userId) => {
    try {
      const { data: socialPost, error: socialError } = await supabase.from("socialing_posts").insert(postInfo).select();
      console.log(socialPost);
      if (socialError) throw new Error("소셜링 업로드 에러", socialError);

      const postId = socialPost[0].id;

      // 유저 정보 가져옴
      const { data: userData, error: userError } = await supabase
        .from("userinfo")
        .select("posts")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      const currentPosts = userData.posts || [];

      const updatePosts = [...currentPosts, { id: postId, type: "socialing_posts" }];

      // 유저 정보 업데이트
      const updateResponse = await supabase.from("userinfo").update({ posts: updatePosts }).eq("id", userId).select();
      console.log("updateResponse", updateResponse);

      return socialPost;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSocialPost = async (postId) => {
    try {
      const response = await supabase.from("socialing_posts").delete().eq("id", postId).select();
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const updateSocialPost = async (newPostInfo, postId) => {
    try {
      const { data: updateData, error: updateError } = await supabase
        .from("socialing_posts")
        .update(newPostInfo)
        .eq("id", postId)
        .select();
      console.log(updateData);
      return updateData;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    challengePosts,
    loadClubPosts,
    loadChallengePosts,
    createChallengePost,
    deleteChallengePost,
    updateChallengePost,
    loungePosts,
    createLoungePost,
    loadLoungePosts,
    deleteLoungePost,
    socialingPosts,
    loadSocialPosts,
    createSocialPost,
    deleteSocialPost,
    updateSocialPost,
  };
});
