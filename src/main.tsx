import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { BallotsPage } from "./Pools/BallotsPage.tsx";
import { CapturePage } from "./Pools/CapturePage.tsx";
import { MatchesPage } from "./Pools/MatchesPage.tsx";
import { NewPoolPage } from "./Pools/NewPoolPage.tsx";
import { PoolPage } from "./Pools/PoolPage.tsx";
import { PoolsPage } from "./Pools/PoolsPage.tsx";
import { PrizesPage } from "./Pools/PrizesPage.tsx";

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
