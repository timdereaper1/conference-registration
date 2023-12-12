import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./pages";
import Dashboard from "./pages/dashboard";
import DashboardLayout from "./pages/dashboard/layout";
import Participants from "./pages/dashboard/participants";
import ParticipantInfo from "./pages/dashboard/participants/[participantId]";
import EditParticipant from "./pages/dashboard/participants/[participantId]/edit";
import RegisterParticipant from "./pages/register";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "register", element: <RegisterParticipant /> },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "participants", element: <Participants /> },
            {
                path: "participants/:participantId",
                children: [
                    { index: true, element: <ParticipantInfo /> },
                    { path: "edit", element: <EditParticipant /> },
                ],
            },
        ],
    },
]);

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={client}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>,
);
