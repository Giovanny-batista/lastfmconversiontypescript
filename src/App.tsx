import { useState } from 'react';
import './App.css';

function App() {
  const [searchType, setSearchType] = useState<string>('artist');// configura um estado que armazena o tipo de pesquisa que o usuário selecionou, com um valor inicial padrão de "artist"
  const [searchTerm, setSearchTerm] = useState<string>('');//variável searchTerm é usada rastrear o termo de pesquisa atual na aplicação. Ela começa com uma string vazia e pode ser atualizada.
  const [searchResult, setSearchResult] = useState<any>({});//A variável searchResult  armazena os resultados da pesquisa. Inicialmente, é definida como um objeto vazio ({}), indicando que não há resultados de pesquisa disponíveis.
  const [similarArtists, setSimilarArtists] = useState<any[]>([]);//a variável  similarArtists  armazena uma lista de artistas similares. Inicialmente, a lista está vazia ([]), indicando que não há artistas similares definidos. 
  const [topTracks, setTopTracks] = useState<any[]>([]);//a variável  topTracks armazena a lista das principais faixas de um artista.
  const [topAlbums, setTopAlbums] = useState<any[]>([]);//a variável topAlbums  armazena uma lista dos principais álbuns de um artista.

  const apiKey = '10cc36340fa83366de1c30701a78ba8a';
  //Verifica se o usuário está realizando uma pesquisa por artista ou por álbum.
  const handleSearch = async () => {
    try {
      let method = 'artist.getinfo';
      if (searchType === 'album') {
        method = 'album.search';
      }

      // Faz a busca pelo artista ou álbum usando a chave da API
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=${method}&${searchType}=${searchTerm}&api_key=${apiKey}&format=json`
      );//A resposta solicitada a Api é convertida para o formato json usando await response.json. os dados são armazenados em 'data'.
      const data = await response.json();
      setSearchResult(data);

      //São definidos como listas vazias para limpar os resultados anteriores
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
        // Busca por artistas similares
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
        // Busca as principais faixas
        //realiza uma solicitação à API para obter informações sobre as principais faixas de um artista e atualiza o estado do componente com essas informações, se a solicitação for bem-sucedida.
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
        // Busca os  principais álbuns
        const topAlbumsResponse = await fetch(//faz solicitação a API da lastfm e guarda as respostas
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
