import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { PoolPage } from "./Pools/PoolPage.tsx";
import { PoolsPage } from "./Pools/PoolsPage.tsx";
import { NewPoolPage } from "./Pools/NewPoolPage.tsx";
import { CapturePage } from "./Pools/CapturePage.tsx";
import { BallotsPage } from "./Pools/BallotsPage.tsx";
import { PrizesPage } from "./Pools/PrizesPage.tsx";
import { MatchesPage } from "./Pools/MatchesPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/pools", element: <PoolsPage /> },
  { path: "/pools/new", element: <NewPoolPage /> },
  { path: "/pools/:poolId", element: <PoolPage /> },
  { path: "/pools/:poolId/ballots", element: <BallotsPage /> },
  { path: "/pools/:poolId/prizes", element: <PrizesPage /> },
  { path: "/pools/:poolId/matches", element: <MatchesPage /> },
  { path: "/pools/:poolId/capture", element: <CapturePage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
