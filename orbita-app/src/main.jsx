import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import App from "./App.jsx";
import { Home } from "./components/Home.jsx";
import HomeView from "./components/HomeView.jsx";
import AllShows from "./components/AllShows.jsx";
import PodcastPage from "./pages/PodcastPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: "podcast/:id",
        element: <PodcastPage />,
      },
      {
        path: "shows",
        element: <AllShows />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
