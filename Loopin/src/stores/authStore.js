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

    const updateUser = (updateValue) => {
      loginUser.value = { ...loginUser.value, ...updateValue };
    };

    const deleteUser = (deleteValue) => {
      loginUser.value = { ...deleteValue };
    };

    return { loginUser, setUser, clearUser, updateUser, deleteUser };
  },
  {
    persist: true,
  },
);
