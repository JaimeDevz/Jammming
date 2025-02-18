import styles from "./SearchResults.module.css";

const SearchResults = ({ results, onAdd }) => {
  return (
    <div className={styles.container}>
      <h2>Results</h2>
      {results.map((track) => (
        <div key={track.id} className={styles.song}>
          <p>
            {track.name} - {track.artist}
          </p>
          <button className={styles.button} onClick={() => onAdd(track)}>
            +
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
