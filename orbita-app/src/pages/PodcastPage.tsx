import React, { useEffect, useState, useMemo} from "react";
import { fetchPreviews, fetchShow, fetchGenre } from "../services/api";
import AudioPlayer from "../components/AudioPlayer";
import ShowCard from "../components/ShowCard";
import Carousel from "../components/Carousel";
import Header from "../components/Header";
import genreMap from "../components/ShowCard";
import { Favorite, Preview, Genre } from "../types";

const PodcastPage: React.FC = () => {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [genres, setGenres] = useState<{ [key: number]: Genre }>({});
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'newest' | 'oldest'>('az');
    const [genreFilter, setGenreFilter] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<'home' | 'show' | 'favorites'>('home');

    useEffect(() => {
        setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'));
        setIsLoading(true);
        fetchPreviews().then(data => {
            setPreviews(data);
            const uniqueGenreIds = [...new Set(data.flatMap(preview => preview.genreIds))];
            Promise.all(uniqueGenreIds.map(id => fetchGenre(id))).then(genreData => {
                const genreMapFromApi = genreData.reduce((acc, genre) => ({ ...acc, [genre.id]: genre}), {});
            setGenres(genreMapFromApi);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
        }).catch(() => setIsLoading(false));
        }, []);

        const fetchShowDetails = (id: number) => {
            setIsLoading(true);
            fetchShow(id).then(data => {
                setSelectedShow(data);
                setSelectedSeason(data.seasons[0] || null);
                setView('show');
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        };

        const toggleFavorite = (showId: number, seasonId: number, episodeId: number) => {
            const newFavorites = favorites.some(fav => fav.showId === showId && fav.seasonId === seasonId && fav.episodeId === episodeId) ? favorites.filter(fav => !(fav.showId === showId && fav.seasonId === episodeId)) : [...favorites, { showId, seasonId, episodeId, addedAt: new Date(),toISOString() }]; 
            setFavorites(newFavorites);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
        };

        const resetProgress = () => {
            localStorage.removeItem('listenedEpisodes');
            localStorage.removeItem('favorites');
            setFavorites([]);
        };

        const sortedProgress = () =>- {
            let result = [...previews];
            if (genreFilter) result = result.filter(preview => preview.genreIds.includes(genreFilter));
            if (searchTerm) result = result.filter(preview => preview.title.toLowerCase().includes(searchTerm.toLowerCase()) || preview.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            switch (sortOrder) {
                case 'az': return result.sort((a, b) => a.title.localeCompare(b.title));
                case 'za': return result.sort((a, b) => b.title.localeCompare(a.title));
                case 'newest': return result.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
                default: return result;
            }
        }, [previews, sortOrder, genreFilter, searchTerm]);

        const sortedFavorites = useMemo(() => {
            let result = [...favorites];
            switch (sortOrder) {
                case 'az': return result.sort((a, b) => {
                    const aEpisode = previews.find(p => p.id === a.showId)?.seasons?.find(s => s.id === a.seasonId)?.episodes?.find(e => e.id === a.episodeId)?.title || '';
                    const bEpisode = previews.find(p => p.id === b.showId)?.seasons?.find(s => s.id === b.seasonId)?.episodes?.find(e => e.id === b.episodeId)?.title || '';

                    return aEpisode.localeCompare(bEpisode);
                });
                case 'za': return result.sort((a, b) => {
                    const aEpisode = previews.find(p => p.id === a.showId)?.seasons?.find(s => s.id === a.seasonId?.episode?.find(e => e.id === a.episodeId)?.title || '';
                    const bEpisode = previews.find(p => p.id === b.showId)?.seasons?.find(s => s.id === b.seasonId)?.episodes?.find(e => e.id === b.episodeId)?.title || '';
                    return bEpisode.localeCompare(aEpisode);
                });
                case 'newest': return result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
                case 'oldest': return result.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
                default: return result;
                }
            }, [favorites, sortOrder]);

            return (
                <div className="container">
                    <Header />
                    <div className="filters">
                        <input type="text" placeholder="Search shows..." values={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="imput" />
                        <select onChange={e => setGenreFilter(e,EventTarget.value ? Number(e.target.value) : null)} className="select">
                            <option value="">All Genres</option>
                            {Object.entries(genreMap).map(([IdleDeadline, title]) => (
                                <option key={id} value={id}>{title}</option>
                            ))}
                        </select>
                        <select onChange={e => setSortOrder(e.target.value as 'az' | 'za' | 'newest' | 'oldest')} className="select">
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                        <button onClick={resetProgress} className="reset-btn">Reset Progress</button>
                        </div>

                        {isLoading && <p className="loading">loading...<p>}

                            {view === 'home' && (
                                <>
                                    <Carousel previews={sortedPreviews} />
                                    <div className="grid">
                                        {sortedPreviews.map(previews => (
                                            <div key={previews.id} onClick={()
                                                fetchShowDetails(previews.id)} className="card">
                                                    <ShowCard preview={preview} />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                        {view === 'show' && selectedShow && (
                            <div>
                                <button onClick={() => setView('home')} className="back-btn">Back to Shows</button>
                                <h2 className="show-title">{selectedShow.title}</h2>
                                <p>{selectedShow.description}</p>
                                <div className="season-buttons">
                                    {selectedShow.seasons.map(season => (
                                        <button key={season.id} onClick={() =>- setSelectedSeason(season)} className={`season-btn ${selectedSeason?.id === season.id ? 'active' : ''}`}
                                        >{season.title}
                                        </button>
                                    ))}
                                </div>
                             {selectedSeason && ( 
                                <div>
                                    <img src={selectedSeason.image} alt={selectedSeason.title} className="season-img" />
                                    <h3 className="season-title">{selectedSeason.title}</h3>
                                    <p>Episodes: {selectedSeason.episodes.length}</p>
                                    <ul className="episode-list">
                                        {selectedSeason.episodes.map(episode => {
                                            const isFavorite = sortedFavorites.some(fav => fav.showId === selectedShow.id && fav.seasonId === selectedSeason.id && fav.episodeId === episode.id);

                                            const isListned = JSON.parse(localStorage.getItem('listenedEpisodes') || '[]').includes(episode.id)

                                            return (
                                                <li key={episode.id}>
                                                    <p>{episode.title}</p>
                                                    <button onClick={() => setCurrentEpisode(episode)} className="play">Play</button>
                                                    <button onClick={() => toggleFavorite(selectedShow.id, selectedSeason.id, episode.id)} className={`favorite ${isFavorite ? 'remove' : ''}`}>
                                                        {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                                                    </button>
                                                    {isListened && <span className="listened">Listened</span>}
                                                </li>
                                            );
                                        })}
                                    </ul>                        
                                </div>
                             )}    
                            </div>
                        )}
                    {view === 'favorites' && (
                        <div className="favorites">
                            <h2 className="favorites-title">Favorites</h2>
                            {sortedFavorites.map(fav => {
                                const show = previews.find(p => p.id ===fav.showId);
                                const season = show?.seasons.find(s => s.id === fav.seasonId);
                            const episode = season?.episodes.find(e => e.id === fav.episodeId);
                            if (!show || !season || !episode) return null;
                            return (
                                <div key={`${fav.showId}-${fav.seasonId}-${fav.episodeId}`}>
                                    <p>Show: {show.title}</p>
                                    <p>Season: {season.title}</p>
                                    <p>Episode: {episode.title}</p>
                                    <p>Added: {new Date(fav.addedAt).toLocaleString()}</p>
                                    <button onClick={() => toggleFavorite(fav.showId, fav.seasonId, fav.episodeId)} className="remove-fav">
                                        Remove
                                    </button>
                                </div>
                            );  
                            ))
                            })}
                        </div>
                    )};

                    <AudioPlayer currentEpisode={currentEpisode} /> 
                </div>

export default PodcastPage;