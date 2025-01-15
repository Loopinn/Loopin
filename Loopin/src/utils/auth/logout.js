import supabase from "@/config/supabase";

export const logout = async () => {
  try {
    const response = await supabase.auth.signOut();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
