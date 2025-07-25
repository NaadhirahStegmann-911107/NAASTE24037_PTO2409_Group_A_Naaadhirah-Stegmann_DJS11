import React from "react";
import { Outlet, Link } from "react-router-dom";
import Layout from "./components/Layout";
import { usePodcasts } from "./hooks/usePodcasts";
import "./App.css";

function App() {
  // The data from this hook will be passed down to the child routes
  // via the Outlet's context prop.
  const podcastData = usePodcasts();

  return (
    <Layout>
      <div>
        <nav>
          {/* Use Link components for navigation */}
          <Link to="/home">Home</Link>
          <Link to="/">Podcasts</Link>
          <Link to="/shows">All Shows</Link>
        </nav>
        {podcastData.isLoading && <p>Loading...</p>}

        {/* The Outlet will render the matched child route.
            We pass the podcastData down to the routes via context. */}
        <Outlet context={podcastData} />
      </div>
    </Layout>
  );
}

export default App;
