import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { BallotsPage } from "./Events/BallotsPage.tsx";
import { CapturePage } from "./Events/CapturePage.tsx";
import { MatchesPage } from "./Events/MatchesPage.tsx";
import { NewEventPage } from "./Events/NewEventPage.tsx";
import { EventPage } from "./Events/EventPage.tsx";
import { EventsPage } from "./Events/EventsPage.tsx";
import { PrizesPage } from "./Events/PrizesPage.tsx";
import { RestrictionsPage } from "./Events/RestrictionsPage.tsx";
import { AddPrizesPage } from "./Events/AddPrizesPage.tsx";
import { ScanPage } from "./ScanPage.tsx";
import { ManualBallotPage } from "./Events/ManualBallotPage.tsx";
import { DelegatedCapturePage } from "./Events/Delegate/DelegatedCapturePage.tsx";
import { DelegatePage } from "./Events/Delegate/DelegatePage.tsx";
import { DelegatedDisplayPage } from "./Events/Delegate/DelegatedDisplayPage.tsx";
import { DelegateCapturePage } from "./Events/Delegate/DelegateCapturePage.tsx";
import { CapturePage as PlanBCapturePage } from "./Events/PlanB/CapturePage.tsx";
import { PrizeStatsPage } from "./Events/PrizeStatsPage.tsx";
import { ExportPage } from "./Events/ExportPage.tsx";
import { ImportBallotsPage } from "./Events/ImportBallotsPage.tsx";
import { ParticipantsPage } from "./Events/ParticipantsPage.tsx";
import { ImportParticipantsPage } from "./Events/ImportParticipantsPage.tsx";
import { ParticipantStatsPage } from "./Events/ParticipantStatsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <EventsPage />,
  },
  { path: "/events", element: <EventsPage /> },
  { path: "/events/new", element: <NewEventPage /> },
  { path: "/events/:eventId", element: <EventPage /> },
  { path: "/events/:eventId/restrictions", element: <RestrictionsPage /> },
  { path: "/events/:eventId/ballots", element: <BallotsPage /> },
  { path: "/events/:eventId/ballots/import", element: <ImportBallotsPage /> },
  { path: "/events/:eventId/prizes", element: <PrizesPage /> },
  { path: "/events/:eventId/prizes/add", element: <AddPrizesPage /> },
  { path: "/events/:eventId/matches", element: <MatchesPage /> },
  { path: "/events/:eventId/participants", element: <ParticipantsPage /> },
  {
    path: "/events/:eventId/participants/import",
    element: <ImportParticipantsPage />,
  },
  { path: "/events/:eventId/capture", element: <CapturePage /> },
  { path: "/events/:eventId/capture/manual", element: <ManualBallotPage /> },
  { path: "/scan", element: <ScanPage /> },
  { path: "/events/:eventId/teams", element: <DelegatePage /> },
  { path: "/events/:eventId/export", element: <ExportPage /> },
  {
    path: "/events/:eventId/teams/capture",
    element: <DelegateCapturePage />,
  },
  { path: "/delegated/capture", element: <DelegatedCapturePage /> },
  { path: "/delegated/display", element: <DelegatedDisplayPage /> },

  { path: "/events/:eventId/prizes/stats", element: <PrizeStatsPage /> },
  {
    path: "/events/:eventId/participants/stats",
    element: <ParticipantStatsPage />,
  },
  { path: "/events/:eventId/planb/capture", element: <PlanBCapturePage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
