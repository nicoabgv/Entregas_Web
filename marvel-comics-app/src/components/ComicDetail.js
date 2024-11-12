import React, { useEffect, useState } from 'react';
import '../styles/ComicDetail.css';
import md5 from 'md5';

const ComicDetail = ({ comicId, onAddToFavorites, onGoBack }) => {
    const [comic, setComic] = useState(null);

    useEffect(() => {
        const fetchComicDetail = async () => {
            try {
                const ts = new Date().getTime();
                const publicKey = '1592933fe313af3712c34a82ed6cd251';
                const privateKey = '6afbbe1bec97888e4a2e62b1af91c6ac87e31e4e';
                const hash = md5(ts + privateKey + publicKey);
                
                const response = await fetch(
                    `https://gateway.marvel.com/v1/public/comics/${comicId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
                );
                const data = await response.json();

                if (data && data.data && data.data.results) {
                    setComic(data.data.results[0]);
                } else {
                    console.error("Error en los datos de la API", data);
                }
            } catch (error) {
                console.error("Error en la llamada a la API:", error);
            }
        };

        fetchComicDetail();
    }, [comicId]);

    if (!comic) return <div>Cargando...</div>;

    return (
        <div className="comic-detail">
            <button onClick={onGoBack}>Regresar</button>
            <h2>{comic.title}</h2>
            <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
            <p>{comic.description || "Descripción no disponible"}</p>
            <h3>Personajes</h3>
            <div className="characters">
                {comic.characters.items.length > 0 ? (
                    comic.characters.items.map(character => (
                        <div key={character.resourceURI} className="character-card">
                            <p>{character.name}</p>
                            <img 
                                src={`https://via.placeholder.com/150?text=${character.name}`} 
                                alt={character.name} 
                            />
                        </div>
                    ))
                ) : (
                    <p>No hay personajes disponibles</p>
                )}
            </div>
            <button onClick={() => onAddToFavorites(comic)}>Añadir a Favoritos</button>
        </div>
    );
};

export default ComicDetail;