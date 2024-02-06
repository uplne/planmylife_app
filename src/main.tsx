import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
      <RouterProvider
        router={router}
        fallbackElement={<p>Initial Load...</p>}
      />
    </QueryClientProvider>
  </React.StrictMode>,
);
