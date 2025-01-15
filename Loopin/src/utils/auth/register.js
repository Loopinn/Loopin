import supabase from "@/config/supabase";

export const register = async (uemail, upassword, unickname) => {
  try {
    const response = await supabase.auth.signUp({
      email: uemail,
      password: upassword,
      options: {
        data: { nickname: unickname },
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};
