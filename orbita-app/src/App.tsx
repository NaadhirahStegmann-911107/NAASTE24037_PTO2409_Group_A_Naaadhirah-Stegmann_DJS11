import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import { HomeView } from './components/HomeView';
import AllShows from './components/AllShows';
import PodcastPage from './pages/PodcastPage';
import './App.css';


const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route index element={<HomeView />} />
          <Route path="/podcast/:id" element={<PodcastPage />} />
          <Route path="/shows" element={<AllShows />} />
        </Route>
      </Routes>
  )
}

export default App;
