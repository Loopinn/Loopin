import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useAuthStore = defineStore(
  "authStore",
  () => {
    const loginUser = ref(null);
    const setUser = (user) => {
      loginUser.value = user;
    };

    const clearUser = () => {
      loginUser.value = null;
    };

    return { loginUser, setUser, clearUser };
  },
  {
    persist: true,
  },
);
