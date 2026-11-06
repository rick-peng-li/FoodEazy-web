import request from "./request";

export const getItems = () => request.get("/api/items");
