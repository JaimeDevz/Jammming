const clientId = "Client_ID";
const redirectUri = "http://localhost:5173/";
const scope =
  "playlist-modify-public playlist-modify-private user-read-private user-read-email";
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(
  scope
)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

const Spotify = {
  accessToken: null,

  // Get Access Token, refresh if expired
  getAccessToken() {
    if (this.accessToken) return this.accessToken;

    const tokenMatch = window.location.hash.match(/access_token=([^&]*)/);
    const expiresMatch = window.location.hash.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresMatch) {
      this.accessToken = tokenMatch[1];
      const expiresIn = Number(expiresMatch[1]);

      // Clear token after expiration
      window.setTimeout(() => (this.accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return this.accessToken;
    } else {
      // Redirect to Spotify login if no token found
      window.location.href = authUrl;
    }
  },

  // Search for tracks
  async search(term) {
    try {
      const accessToken = this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(
          term
        )}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = await response.json();
      if (!data.tracks) throw new Error("No tracks found.");

      return data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (error) {
      console.error("Search Error:", error);
      return [];
    }
  },

  // Get Current User Profile
  async getCurrentUser() {
    try {
      const accessToken = this.getAccessToken();
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user info");
      return await response.json();
    } catch (error) {
      console.error("User Info Error:", error);
      return null;
    }
  },

  // Create a Playlist and Add Songs
  async savePlaylist(name, trackUris) {
    if (!name || trackUris.length === 0) return;

    try {
      const accessToken = this.getAccessToken();
      const user = await this.getCurrentUser();

      // Create a new playlist
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${user.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, public: false }),
        }
      );

      const playlistData = await playlistResponse.json();
      if (!playlistData.id) throw new Error("Playlist creation failed.");

      // Add tracks to the playlist
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: trackUris }),
        }
      );

      return playlistData.id;
    } catch (error) {
      console.error("Playlist Save Error:", error);
      return null;
    }
  },
};

export default Spotify;
