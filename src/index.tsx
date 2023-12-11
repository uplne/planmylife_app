import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "regenerator-runtime/runtime.js";

// import * as serviceWorker from './serviceWorker';
import { Router } from './containers/Router';
// import checkAwake from './utils/awake';

// import './index.css';

// checkAwake();

const router = createBrowserRouter(Router);

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  </React.StrictMode>
);
