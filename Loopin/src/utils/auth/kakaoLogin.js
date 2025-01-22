import supabase from "@/config/supabase";

export const kakaoLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
    });

    if (error) {
      console.log("OAuth 호출 실패: ", error);
      return { data: null, error };
    }

    console.log("OAuth 호출 성공: ", data);

    return { data, error: null };
  } catch (error) {
    console.log("kakaoLogin 함수 내부 오류 발생: ", error);
    return { data: null, error };
  }
};
