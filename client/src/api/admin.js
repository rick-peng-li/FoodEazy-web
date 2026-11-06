import request from "./request";

export const getAdminItems = () => request.get("/api/admin/items");
export const addProduct = (formData) =>
  request.post("/api/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProduct = (name) =>
  request.post("/api/admin/items", { name });
