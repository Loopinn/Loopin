import supabase from "@/config/supabase";

export const register = async (uemail, upassword, unickname) => {
  try {
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
