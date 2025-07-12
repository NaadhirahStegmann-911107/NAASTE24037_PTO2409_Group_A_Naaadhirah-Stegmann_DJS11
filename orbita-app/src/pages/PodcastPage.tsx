import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import { fetchPreviews, fetchShow, fetchGenre } from "../services/api";
import AudioPlayer from "../components/AudioPlayer";
import ShowCard from "../components/ShowCard";
import Carousel from "../components/Carousel";
import type { Favorite, Preview, Genre, Show, Season, Episode } from "../types";
import debounce from "lodash.debounce";

const PodcastPage: React.FC = () => {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [genres, setGenres] = useState<{ [key: number]: Genre }>({});
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'newest' | 'oldest'>('az');
    const [genreFilter, setGenreFilter] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<'home' | 'show'>('home');
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = storedFavorites.map((fav: Favorite) => {
            if (!fav.showTitle || !fav.seasonTitle || !fav.episodeTitle) {
                const show = previews.find(p => Number(p.id) === fav.showId);
                const season = Array.isArray(show?.seasons) ? show.seasons.find(s => s.id === fav.seasonId) : undefined;
                const episode: Episode | undefined = season?.episodes.find((e: Episode) => e.id === fav.episodeId);
                return {
                    ...fav,
                    showTitle: show?.title || 'Unknown Show',
                    seasonTitle: season?.title || 'unnknown Season',
                    episodeTitle: episode?.title || 'Unknown Episode'
                };
            }
            return fav;
        });
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        setIsLoading(true);
        fetchPreviews().then(data => {
            // Convert id from number to string for each preview
            const previewsWithStringId = data.map((preview: Preview) => ({
                ...preview,
                id: String(preview.id),
            }));
            setPreviews(previewsWithStringId);
            const uniqueGenreIds = [...new Set(previewsWithStringId.flatMap(preview => preview.genreIds))];
            Promise.all(uniqueGenreIds.map(id => fetchGenre(id))).then(genreData => {
                const genreMapFromApi = genreData.reduce((acc, genre) => ({ ...acc, [genre.id]: genre }), {});
                setGenres(genreMapFromApi);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
        })
        .catch(() => setIsLoading(false));
    }, [previews]);

    useEffect(() => {
        document.body.classList.toggle('modal-open', isFavoritesModalOpen);
    }, [isFavoritesModalOpen]);

    const fetchShowDetails = (id: number) => {
        setIsLoading(true);
        fetchShow(id).then(data => {
            // Ensure required properties are present and episodes are typed correctly
            const showWithRequiredProps: Show = {
                ...data,
                image: data.image ?? "",
                genres: data.genres ?? [],
                updated: data.updated ?? new Date().toISOString(),
                seasons: (data.seasons ?? []).map(season => ({
                    ...season,
                    episodes: (season.episodes ?? []).map(episode => ({
                        ...episode,
                        audioUrl: episode.audioUrl ?? "",
                        duration: episode.duration ?? 0,
                        description: episode.description ?? "",
                    })),
                })),
            };
            setSelectedShow(showWithRequiredProps);
            setSelectedSeason(showWithRequiredProps.seasons[0] || null);
            setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    };

    const toggleFavorite = (showId: number, seasonId: number, episodeId: number) => {
        const exists = favorites.some(fav => fav.showId === showId && fav.seasonId === seasonId && fav.episodeId === episodeId);
        let newFavorites;
        if (exists) {
            newFavorites = favorites.filter(fav => !(fav.showId === showId && fav.seasonId === seasonId && fav.episodeId === episodeId));
            setFavorites(newFavorites);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
        } else {
            if (!selectedShow || !selectedSeason) {
                console.warn('Cannot add favorite: No show or season selected');
                return;
            }
            const show = selectedShow;
            const season = selectedSeason;
            const episode = season?.episodes.find(e => e.id === episodeId);
            if (!episode) {
                console.warn('Cannot add favorite: Episode not found');
                return;
            }
            newFavorites = [
                ...favorites, 
                {
                  showId,
                  seasonId,
                  episodeId,
                  addedAt: new Date().toISOString(),
                  showTitle: show.title,
                  seasonTitle: season.title,
                  episodeTitle: episode.title,
                }
            ];
            setFavorites(newFavorites);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
        }
    };

    const resetProgress = () => {
        localStorage.removeItem('listenedEpisodes');
        localStorage.removeItem('favorites');
        setFavorites([]);
    };

    const sortedPreviews = useMemo(() => {
        let result = [...previews];
        if (genreFilter) result = result.filter(preview => preview.genreIds.includes(genreFilter));
        if (searchTerm) 
            result = result.filter(
            preview =>
              preview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              preview.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        switch (sortOrder) {
            case 'az': 
                return result.sort((a, b) => a.title.localeCompare(b.title));
            case 'za': 
                return result.sort((a, b) => b.title.localeCompare(a.title));
            case 'newest': 
                return result.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
            case 'oldest': 
                return result.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());
            default: 
                return result;
        }
    }, [previews, sortOrder, genreFilter, searchTerm]);

    const sortedFavorites = useMemo(() => {
        const result = [...favorites];
        switch (sortOrder) {
            case 'az':
                return result.sort((a, b) => a.episodeTitle.localeCompare(b.episodeTitle));
            case 'za':
                return result.sort((a, b) => b.episodeTitle.localeCompare(a.episodeTitle));
            case 'newest':
                return result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            case 'oldest':
                return result.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
            default:
                return result;
        }
    }, [favorites, sortOrder]);
    const debouncedSetSearchTerm = useMemo(
        () => debounce((value: string) => setSearchTerm(value), 300),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchTerm(e.target.value);
    };

    return (
        <div className="container">
                <input
                    type="text"
                    placeholder="Search shows..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="input"
                    aria-label="Search shows"
                />
                <select
                    onChange={e => setGenreFilter(e.target.value ? Number(e.target.value) : null)}
                    className="select"
                    value={genreFilter ?? ''}
                    aria-label="Filter by genre"
                >
                    <option value="">All Genres</option>
                    {Object.entries(genres).map(([id, genre]) => (
                        <option key={id} value={id}>{genre.title}</option>
                    ))}
                </select>
                <select
                    onChange={e => setSortOrder(e.target.value as 'az' | 'za' | 'newest' | 'oldest')}
                    className="select"
                    value={sortOrder}
                    aria-label="Sort order"
                >
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
                <button onClick={resetProgress} className="reset-btn" aria-label="reset progress">Reset Progress</button>
                <button onClick={() => setIsFavoritesModalOpen(true)} className="view-fav-btn" aria-label="View favorites">View Favorites</button>

            {isLoading && <p className="loading">Loading...</p>}

            {view === 'home' && (
                <>
                    <Carousel previews={sortedPreviews} genres={genres} />
                    <div className="grid">
                        {sortedPreviews.map(preview => (
                            <div key={preview.id} onClick={() => fetchShowDetails(Number(preview.id))} className="card">
                                <ShowCard preview={preview} genres={genres} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {view === 'show' && selectedShow && (
                <div>
                    <button onClick={() => setView('home')} className="back-btn" aria-label="Back to shows list">Back to Shows</button>
                    <h2 className="show-title">{selectedShow.title}</h2>
                    <p>{selectedShow.description}</p>
                    <div className="season-buttons">
                        {selectedShow.seasons.map(season => (
                            <button
                                key={season.id}
                                onClick={() => setSelectedSeason(season)}
                                className={`season-btn ${selectedSeason?.id === season.id ? 'active' : ''}`}
                                aria-label={`Select Season ${season.title}`}
                            >
                                {season.title}
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
                                    const isFavorite = favorites.some(fav =>
                                        fav.showId === selectedShow.id &&
                                        fav.seasonId === selectedSeason.id &&
                                        fav.episodeId === episode.id
                                    );
                                    const listenedEpisodes = (() => {
                                        try{
                                            const data = JSON.parse(localStorage.getItem('listenedEpisodes') || '[]');
                                            return Array.isArray(data) ? data : [];
                                        } catch {
                                            return [];
                                        }
                                    })();
                                    const isListened = listenedEpisodes.includes(episode.id);

                                    return (
                                        <li key={episode.id}>
                                            <p>{episode.title}</p>
                                            <button onClick={() => setCurrentEpisode(episode)} className="play" aria-label="{`Play episode ${episode.title}`}">Play</button>
                                            <button
                                                onClick={() => toggleFavorite(selectedShow.id, selectedSeason.id, episode.id)}
                                                className={`favorite ${isFavorite ? 'remove' : ''}`} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                            >
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

            {isFavoritesModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsFavoritesModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="favorites-title">
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsFavoritesModalOpen(false)} className="close-modal-btn" aria-label="Close favorite modal">&times;</button>
                        <h2 id="favorites-titles" className="favorites-title">Favorites</h2>
                        {sortedFavorites.length > 0 ? (
                            sortedFavorites.map(fav => (
                                <div key={`${fav.showId}-${fav.seasonId}-${fav.episodeId}`} className="favorite-item">
                                    <p><strong>Show:</strong> {fav.showTitle}</p>
                                    <p><strong>Season:</strong> {fav.seasonTitle}</p>
                                    <p><strong>Episode:</strong> {fav.episodeTitle}</p>
                                    <p>Added: {new Date(fav.addedAt).toLocaleString()}</p>
                                    <button
                                        onClick={() => toggleFavorite(fav.showId, fav.seasonId, fav.episodeId)}
                                        className="remove-fav"
                                        aria-label={`Remove ${fav.episodeTitle} from favorites`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>You have no favorite episodes yet.</p>
                        )}
                    </div>
                </div>
            )}

            <AudioPlayer currentEpisode={currentEpisode ? { ...currentEpisode, id: String(currentEpisode.id), file: currentEpisode.audioUrl } : null} />
        </div>
    );
};

export default PodcastPage;