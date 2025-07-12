import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
// import PodcastPage from './pages/PodcastPage';
import './App.css'

// A placeholder for the home page
const HomePage = () => (
  <div className="card">
    <h1>Welcome to Orbita</h1>
    <p>Your podcast journey starts here.</p>
  </div>
);

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/podcast/:id" element={<PodcastPage />} /> */}
      </Routes>
    </div>
  )
}

export default App
