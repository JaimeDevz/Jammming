import { useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import styles from "./App.module.css";
import Spotify from "./utils/Spotify";

const App = () => {
  const [results, setResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const handleSearch = async (query) => {
    const tracks = await Spotify.search(query);
    setResults(tracks);
  };

  const addTrack = (track) => {
    if (!playlist.some((t) => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylist(playlist.filter((t) => t.id !== track.id));
  };

  const savePlaylist = async () => {
    const trackURIs = playlist.map((track) => `spotify:track:${track.id}`);
    await Spotify.savePlaylist("My Jammming Playlist", trackURIs);
    setPlaylist([]);
  };

  return (
    <div className={styles.container}>
      <h1>Jammming</h1>
      <SearchBar onSearch={handleSearch} />
      <div className={styles.appBody}>
        <SearchResults results={results} onAdd={addTrack} />
        <Playlist
          playlist={playlist}
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
};

export default App;
