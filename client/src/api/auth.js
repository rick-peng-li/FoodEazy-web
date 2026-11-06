import request from "./request";

export const register = (data) => request.post("/api/register", data);
export const login = (data) => request.post("/api/login", data);
export const getMe = () => request.get("/api/login");
export const verifyEmail = (uid) => request.post("/api/verify", { uid });
export const resendCode = (id) => request.post("/api/resend", { id });
export const forgetPassword = (email) => request.post("/api/forget", { email });
export const checkResetCode = (code) =>
  request.get("/api/reset", { params: { code } });
export const resetPassword = (code, password) =>
  request.post("/api/reset", { code, password });
