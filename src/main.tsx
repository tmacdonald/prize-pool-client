import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { BallotsPage } from "./Events/BallotsPage.tsx";
import { CapturePage } from "./Events/CapturePage.tsx";
import { MatchesPage } from "./Events/MatchesPage.tsx";
import { NewEventPage } from "./Events/NewEventPage.tsx";
import { EventPage } from "./Events/EventPage.tsx";
import { EventsPage } from "./Events/EventsPage.tsx";
import { PrizesPage } from "./Events/PrizesPage.tsx";
import { RestrictionsPage } from "./Events/RestrictionsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/events", element: <EventsPage /> },
  { path: "/events/new", element: <NewEventPage /> },
  { path: "/events/:eventId", element: <EventPage /> },
  { path: "/events/:eventId/restrictions", element: <RestrictionsPage /> },
  { path: "/events/:eventId/ballots", element: <BallotsPage /> },
  { path: "/events/:eventId/prizes", element: <PrizesPage /> },
  { path: "/events/:eventId/matches", element: <MatchesPage /> },
  { path: "/events/:eventId/capture", element: <CapturePage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
