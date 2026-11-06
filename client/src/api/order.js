import request from "./request";

export const createOrder = (data) => request.post("/api/orders", data);
export const getOrderById = (orderid) =>
  request.get("/api/orders", { params: { orderid } });
export const getMyOrders = () => request.get("/api/get_orders");
export const payWithPaytm = (data) =>
  request.post("/api/paytm", data, { responseType: "document" });
