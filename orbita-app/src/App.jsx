import React, { useState } from "react";
import Layout from "./components/Layout";
import { Home } from "./components/Home";
import HomeView from "./components/HomeView";
import AllShows from "./components/AllShows";
import PodcastPage from "./pages/PodcastPage";
import { usePodcasts } from "./hooks/usePodcasts";
import "./App.css";

function App() {
  const [view, setView] = useState("home");
  const [podcastId, setPodcastId] = useState(null);
  const { previews, genres, fetchShowDetails, isLoading } = usePodcasts();

  const handleNavigate = (newView, id) => {
    setView(newView);
    if (id) setPodcastId(id);
  };

  return (
    <Layout>
      <div>
        <nav>
          <button onClick={() => handleNavigate("home")}>Home</button>
          <button onClick={() => handleNavigate("homeView")}>Home View</button>
          <button onClick={() => handleNavigate("shows")}>All Shows</button>
          <button onClick={() => handleNavigate("podcast", "1")}>
            Podcast
          </button>
        </nav>
        {isLoading && <p>Loading...</p>}
        {!previews.length && !isLoading && (
          <p>No previews available. Check console.</p>
        )}
        {view === "home" && <Home />}
        {view === "homeView" && previews && previews.length > 0 && (
          <HomeView
            previews={previews}
            genres={genres}
            fetchShowDetails={fetchShowDetails}
          />
        )}
        {view === "podcast" && podcastId && (
          <PodcastPage podcastId={podcastId} />
        )}
        {view === "shows" && previews && previews.length > 0 && (
          <AllShows previews={previews} />
        )}
      </div>
    </Layout>
  );
}

export default App;
