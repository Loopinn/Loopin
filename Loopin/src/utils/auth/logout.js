import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";

export const logout = async () => {
  try {
    const response = await supabase.auth.signOut();
    console.log(response);

    const authStore = useAuthStore();
    authStore.clearUser();

    console.log("authStore cleared: ", authStore.loginUser);
  } catch (error) {
    console.error(error);
  }
};
