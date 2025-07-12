import React from "react";
import ShowCard from "./ShowCard";
import type { Preview } from "./ShowCard";

interface CarouselProps {
    previews: Preview[];
}

const Carousel: React.FC<CarouselProps> = ({ previews }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % previews.length);
        }, 3000);
        return () => clearInterval (interval);
        }, [previews.length]);
        
        return (
            <div className="carousel">
                {previews.map((preview, index) => (
                    <div key={preview.id} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
                        <ShowCard preview={preview} />
                    </div>
                ))}
            </div>
        );
    };

export default Carousel;