import React, { useEffect, useState } from 'react';
import md5 from 'md5';
import ComicCard from './ComicCard';
import '../styles/ComicList.css';

const ComicList = ({ onSelectComic }) => {
    const [comics, setComics] = useState([]);

    useEffect(() => {
        const fetchComics = async () => {
            try {
                const ts = new Date().getTime();
                const publicKey = '1592933fe313af3712c34a82ed6cd251';
                const privateKey = '6afbbe1bec97888e4a2e62b1af91c6ac87e31e4e';
                const hash = md5(ts + privateKey + publicKey);

                const response = await fetch(
                    `https://gateway.marvel.com/v1/public/comics?orderBy=-modified&limit=20&ts=${ts}&apikey=${publicKey}&hash=${hash}`
                );
                const data = await response.json();

                if (data && data.data && data.data.results) {
                    setComics(data.data.results);
                } else {
                    console.error("Error en los datos de la API", data);
                }
            } catch (error) {
                console.error("Error en la llamada a la API:", error);
            }
        };

        fetchComics();
    }, []);

    return (
        <div>
            <h1>Últimos Cómics</h1>
            <div className="comic-list">
                {comics.map(comic => (
                    <ComicCard key={comic.id} comic={comic} onSelectComic={onSelectComic} />
                ))}
            </div>
        </div>
    );
};

export default ComicList;