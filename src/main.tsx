import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

import { AuthProvider } from "./components/AuthProvider";

import "./App.css";

import { Router } from "./containers/Router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const queryClient = new QueryClient();

const router = createBrowserRouter(Router);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ hashed: false }}>
        <AuthProvider>
          <RouterProvider
            router={router}
            fallbackElement={<p>Initial Load...</p>}
          />
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
