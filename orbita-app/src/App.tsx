import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import HomeView from './components/HomeView';
import AllShows from './components/AllShows';
import PodcastPage from './pages/PodcastPage';
import { usePodcasts } from './hooks/usePodcasts';
import './App.css';


const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<HomeViewWrapper />} />
          <Route path="/podcast/:id" element={<PodcastPage />} />
          <Route path="/shows" element={<AllShows />} />
        </Route>
      </Routes>
  )
}

const HomeViewWrapper: React.FC = () => {
  const { previews, genres, fetchShowDetails, isLoading } = usePodcasts();

  if (isLoading) return <p>Loading...</p>;

  return <HomeView previews={previews} genres={genres} fetchShowDetails={fetchShowDetails} />
}
export default App;
