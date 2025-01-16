import supabase from "@/config/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePostStore = defineStore("postStore", () => {
  const socialingPosts = ref([]);
  const clubPosts = ref([]);
  const challengePosts = ref([]);

  const loadSocialingPosts = async () => {
    let { data, error } = await supabase.from("club_posts").select("*");

    if (error) {
      //오류 발생 시 로직
      console.log(error);
    }
    if (data) {
      socialingPosts.value = data;
    }
  };
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

  const createSocialingPost = async (createSocialingForm) => {
    const newPost = Object.assign({}, createSocialingForm);

    const { error } = await supabase.from("socialing_posts").insert([newPost]).select();
    if (error) {
      //오류 발생 시 로직
      console.log(error);
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

  return {
    challengePosts,
    loadSocialingPosts,
    loadClubPosts,
    loadChallengePosts,
    createChallengePost,
    deleteChallengePost,
    updateChallengePost,
  };
});
