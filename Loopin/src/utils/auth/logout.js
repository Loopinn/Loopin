import supabase from "@/config/supabase";
import { useAuthStore } from "@/stores/authStore";

export const logout = async () => {
  try {
    const response = await supabase.auth.signOut();


    const authStore = useAuthStore();
    authStore.clearUser();


  } catch (error) {
    console.error(error);
  }
};
