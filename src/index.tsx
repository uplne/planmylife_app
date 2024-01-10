import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import "regenerator-runtime/runtime.js";

import './App.css';

// import * as serviceWorker from './serviceWorker';
import { Router } from './containers/Router';
// import checkAwake from './utils/awake';

// import './index.css';

// checkAwake();

const queryClient = new QueryClient();

const router = createBrowserRouter(Router);

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  // use Fragment for disabling double render in dev
  <React.Fragment>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </QueryClientProvider>
  </React.Fragment>
);
