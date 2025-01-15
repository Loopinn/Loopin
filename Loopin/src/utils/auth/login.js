import supabase from "@/config/supabase";

export const login = async (uemail, upassword) => {
  try {
    const response = await supabase.auth.signInWithPassword({
      email: uemail,
      password: upassword,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};
