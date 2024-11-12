// src/App.js
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ComicList from './components/ComicList';
import ComicDetail from './components/ComicDetail';
import FavoriteComics from './components/FavoriteComics';
import './App.css';

function App() {
    const [selectedComicId, setSelectedComicId] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    const handleSelectComic = id => setSelectedComicId(id);

    const handleAddToFavorites = comic => {
        if (!favorites.some(fav => fav.id === comic.id)) {
            const updatedFavorites = [...favorites, comic];
            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

            Swal.fire({
                title: 'Agregado a Favoritos',
                text: `${comic.title} ha sido agregado a tus favoritos.`,
                icon: 'success',
                confirmButtonText: 'Ok',
            });
        } else {
            Swal.fire({
                title: 'Ya en Favoritos',
                text: `${comic.title} ya está en tus favoritos.`,
                icon: 'info',
                confirmButtonText: 'Ok',
            });
        }
    };

    const handleRemoveFavorite = (comicId) => {
        const updatedFavorites = favorites.filter(comic => comic.id !== comicId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        Swal.fire({
            title: 'Eliminado de Favoritos',
            text: 'El cómic ha sido eliminado de tus favoritos.',
            icon: 'warning',
            confirmButtonText: 'Ok',
        });
    };

    const handleGoBack = () => setSelectedComicId(null);

    return (
        <div className="App">
            {selectedComicId ? (
                <ComicDetail 
                    comicId={selectedComicId} 
                    onAddToFavorites={handleAddToFavorites} 
                    onGoBack={handleGoBack}
                />
            ) : (
                <>
                    <ComicList onSelectComic={handleSelectComic} />
                    <FavoriteComics 
                        favorites={favorites} 
                        onRemoveFavorite={handleRemoveFavorite} 
                    />
                </>
            )}
        </div>
    );
}

export default App;