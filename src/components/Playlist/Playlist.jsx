import styles from "./Playlist.module.css";

const Playlist = ({ playlist, onRemove, onSave }) => {
  return (
    <div className={styles.container}>
      <h2>Playlist</h2>
      {playlist.map((track) => (
        <div key={track.id} className={styles.song}>
          <p>
            {track.name} - {track.artist}
          </p>
          <button className={styles.button} onClick={() => onRemove(track)}>
            -
          </button>
        </div>
      ))}
      <button className={styles.saveButton} onClick={onSave}>
        Save to Spotify
      </button>
    </div>
  );
};

export default Playlist;
