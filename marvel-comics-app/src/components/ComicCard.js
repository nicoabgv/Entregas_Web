import React from 'react';
import '../styles/ComicCard.css';

const ComicCard = ({ comic, onSelectComic }) => {
    return (
        <div 
            onClick={() => onSelectComic(comic.id)} 
            className="comic-card"
            role="button" 
            aria-label={`Ver detalles de ${comic.title}`}
        >
            <h3>{comic.title}</h3>
            <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
        </div>
    );
};

export default ComicCard;