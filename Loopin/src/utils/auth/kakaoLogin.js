import supabase from "@/config/supabase";

export const kakaoLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
  });

  console.log(data, error);
};
