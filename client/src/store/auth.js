import { create } from "zustand";
import { login as loginApi, register as registerApi, getMe } from "@/api/auth";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: null,
  loading: false,

  login: async (payload) => {
    set({ loading: true });
    try {
      const res = await loginApi(payload);
      localStorage.setItem("token", res.token);
      set({ token: res.token, loading: false });
      await get().loadUser();
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const res = await registerApi(payload);
      localStorage.setItem("token", res.token);
      set({ token: res.token, loading: false });
      await get().loadUser();
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  loadUser: async () => {
    if (!get().token) return;
    try {
      const user = await getMe();
      set({ user });
    } catch {
      get().logout();
    }
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
