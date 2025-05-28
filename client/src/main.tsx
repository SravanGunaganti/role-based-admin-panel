import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { OrdersProvider } from "./context/OrderContext";
import { UsersProvider } from "./context/UsersContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <UsersProvider>
          <OrdersProvider>
            <App />
          </OrdersProvider>
        </UsersProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);
