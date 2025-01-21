import supabase from "@/config/supabase";

export const register = async (uemail, upassword, unickname) => {
  try {
    const { data: existingUser, error: emailCheckError } = await supabase
      .from("userinfo")
      .select("email")
      .eq("email", uemail)
      .single();

    if (emailCheckError && emailCheckError.code !== "PGRST116") {
      console.error("이메일 확인 중 오류 발생:", emailCheckError);
      throw new Error("이메일 확인 중 문제가 발생했습니다.");
    }

    if (existingUser) {
      return {
        error: { message: "이미 사용 중인 이메일입니다." },
      };
    }

    const response = await supabase.auth.signUp({
      email: uemail,
      password: upassword,
      options: {
        data: { nickname: unickname, description: "안녕하세요.", profile_img: null },
      },
    });
    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
  }
};
