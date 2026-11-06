import React from "react";
import ReactDOM from "react-dom";
import AuthState from "./context/auth/authState";
import CartState from "./context/cart/cartState";
import ProductState from "./context/products/productState";
import LoadingState from "./context/loading/loadingState";
import axios from "axios";

import App from "./App";

const rootElement = document.getElementById("root");
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "";
ReactDOM.render(
  <React.StrictMode>
    <AuthState>
      <LoadingState>
        <ProductState>
          <CartState>
            <App />
          </CartState>
        </ProductState>
      </LoadingState>
    </AuthState>
  </React.StrictMode>,
  rootElement
);
