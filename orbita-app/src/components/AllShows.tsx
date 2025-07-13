import React, { useState, useEffect } from 'react';
import { fetchPreviews } from '../services/api';
import type { Preview } from '../services/api';

const AllShows: React.FC = () => {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPreviews = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPreviews();
                setPreviews(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        getPreviews();
    }, []); 

    if (loading) {
        return <div>Loading shows...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>All Shows</h1>
            <div className="show-list">
                {previews.map((show) => (
                    <div key={show.id} className="show-preview">
                        <img src={show.image} alt={show.title} width="100" />
                        <h2>{show.title}</h2>
                        <p>Seasons: {show.seasons}</p>
                        <p>Last updated: {new Date(show.updated).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllShows;

