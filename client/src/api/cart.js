import request from "./request";

export const getCart = () => request.get("/api/cart");
export const saveCart = (payload) => request.post("/api/cart", payload);
export const clearCart = () => request.put("/api/cart");
