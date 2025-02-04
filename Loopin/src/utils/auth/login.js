import supabase from "@/config/supabase";

export const login = async (uemail, upassword) => {
  try {
    const response = await supabase.auth.signInWithPassword({
      email: uemail,
      password: upassword,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
