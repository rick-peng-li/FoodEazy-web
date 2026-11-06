import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App";
import useAuthStore from "@/store/auth";
import useCartStore from "@/store/cart";

const AppInit = () => {
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      useAuthStore.getState().loadUser().then(() => {
        useCartStore.getState().load();
      });
    }
  }, []);
  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: "#fa8c16" } }}>
      <BrowserRouter>
        <AppInit />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
