import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Pool } from "./Pools/Pool.tsx";
import { Index as Pools } from "./Pools/Index";
import { NewPool } from "./Pools/New.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/pools", element: <Pools /> },
  { path: "/pools/new", element: <NewPool /> },
  { path: "/pools/:poolId", element: <Pool /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
