import { create } from "zustand";
import { getCart, saveCart, clearCart as clearCartApi } from "@/api/cart";
import useAuthStore from "./auth";

const useCartStore = create((set, get) => ({
  total_quantity: 0,
  total_price: 0,
  items: [],

  load: async () => {
    const auth = useAuthStore.getState();
    if (!auth.token || !auth.user) return;
    try {
      const cart = await getCart();
      set({
        items: cart.items || [],
        total_quantity: cart.total_quantity || 0,
        total_price: cart.total_price || 0,
      });
    } catch {
      set({ items: [], total_quantity: 0, total_price: 0 });
    }
  },

  add: (item) => {
    const { items } = get();
    const existing = items.find((i) => i.name === item.name);
    let next;
    if (existing) {
      next = items.map((i) =>
        i.name === item.name ? { ...i, q: i.q + 1 } : i
      );
    } else {
      next = [...items, { ...item, q: 1 }];
    }
    get().persist(next);
  },

  remove: (name) => {
    const next = get().items.filter((i) => i.name !== name);
    get().persist(next);
  },

  updateQty: (name, q) => {
    if (q <= 0) return get().remove(name);
    const next = get().items.map((i) => (i.name === name ? { ...i, q } : i));
    get().persist(next);
  },

  persist: (items) => {
    const total_quantity = items.reduce((s, i) => s + i.q, 0);
    const total_price = items.reduce((s, i) => s + i.q * i.price, 0);
    set({ items, total_quantity, total_price });
    const user = useAuthStore.getState().user;
    if (user) {
      saveCart({ user_id: user._id, cart: { items, total_quantity, total_price } });
    }
  },

  clear: async () => {
    await clearCartApi();
    set({ items: [], total_quantity: 0, total_price: 0 });
  },
}));

export default useCartStore;
