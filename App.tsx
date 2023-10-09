import { useState } from 'react';
import './App.css';

function App() {
  const [searchType, setSearchType] = useState<string>('artist');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>({});
  const [similarArtists, setSimilarArtists] = useState<any[]>([]);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topAlbums, setTopAlbums] = useState<any[]>([]);

  const apiKey = '';

  const handleSearch = async () => {
    try {
      let method = 'artist.getinfo';
      if (searchType === 'album') {
        method = 'album.search';
      }

      
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=${method}&${searchType}=${searchTerm}&api_key=${apiKey}&format=json`
      );
      const data = await response.json();
      setSearchResult(data);

      setSimilarArtists([]);
      setTopTracks([]);
      setTopAlbums([]);
    } catch (error) {
      console.error('Erro ao buscar informações:', error);
    }
  };

  const handleSimilarArtists = async () => {
    if (searchType === 'artist' && searchResult.artist) {
      try {
        
        const similarArtistsResponse = await fetch(
          `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${searchResult.artist.name}&api_key=${apiKey}&format=json`
        );
        const similarArtistsData = await similarArtistsResponse.json();
        setSimilarArtists(similarArtistsData.similarartists.artist);
      } catch (error) {
        console.error('Erro ao buscar artistas similares:', error);
      }
    }
  };

  const handleTopTracks = async () => {
    if (searchType === 'artist' && searchResult.artist) {
      try {
        
        const topTracksResponse = await fetch(
          `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${searchResult.artist.name}&api_key=${apiKey}&format=json`
        );
        const topTracksData = await topTracksResponse.json();
        setTopTracks(topTracksData.toptracks.track);
      } catch (error) {
        console.error('Erro ao buscar principais faixas:', error);
      }
    }
  };

  const handleTopAlbums = async () => {
    if (searchType === 'artist' && searchResult.artist) {
      try {
        
        const topAlbumsResponse = await fetch(
          `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${searchResult.artist.name}&api_key=${apiKey}&format=json`
        );
        const topAlbumsData = await topAlbumsResponse.json();
        setTopAlbums(topAlbumsData.topalbums.album);
      } catch (error) {
        console.error('Erro ao buscar principais álbuns:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Last.fm</h1>
      <div>
        <label>
          Pesquisar por:
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="artist">Artista</option>
            <option value="album">Álbum</option>
          </select>
        </label>
      </div>
      <input
        type="text"
        placeholder={`Digite o nome do ${searchType}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Pesquisar</button>

      {searchResult.artist && searchType === 'artist' && (
        <div>
          <h2>Informações do Artista</h2>
          <p>Nome: {searchResult.artist.name}</p>
        </div>
      )}

      {searchType === 'album' && searchResult.results && (
        <div>
          <h2>Resultados da Pesquisa de Álbum</h2>
          {searchResult.results.albummatches.album.map((album: any) => (
            <div key={album.name}>
              <p>Nome do Álbum: {album.name}</p>
              <p>Artista: {album.artist}</p>
            </div>
          ))}
        </div>
      )}

      {searchType === 'artist' && (
        <div>
          <button onClick={handleSimilarArtists}>Artistas Similares</button>
          {similarArtists.length > 0 && (
            <div>
              <h2>Artistas Similares</h2>
              <ul>
                {similarArtists.map((artist: any) => (
                  <li key={artist.name}>{artist.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleTopTracks}>Principais Faixas</button>
          {topTracks.length > 0 && (
            <div>
              <h2>Principais Faixas</h2>
              <ul>
                {topTracks.map((track: any) => (
                  <li key={track.name}>{track.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleTopAlbums}>Principais Álbuns</button>
          {topAlbums.length > 0 && (
            <div>
              <h2>Principais Álbuns</h2>
              <ul>
                {topAlbums.map((album: any) => (
                  <li key={album.name}>{album.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
