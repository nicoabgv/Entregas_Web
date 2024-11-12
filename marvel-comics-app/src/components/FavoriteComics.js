import React from 'react';
import '../styles/FavoriteComics.css';

const FavoriteComics = ({ favorites, onRemoveFavorite }) => {
    return (
        <div>
            <h2>Cómics Favoritos</h2>
            <div className="favorite-comics">
                {favorites.length > 0 ? (
                    favorites.map(comic => (
                        <div key={comic.id} className="favorite-comic-card">
                            <h3>{comic.title}</h3>
                            <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
                            <button onClick={() => onRemoveFavorite(comic.id)}>Eliminar de Favoritos</button>
                        </div>
                    ))
                ) : (
                    <p>No tienes cómics en favoritos.</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteComics;