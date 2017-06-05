import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class SpotifyService {
  requestOptions;

  constructor(private http: Http) { }

  searchArtist(artistName) {
    this._setRequestBearer();
    const url = `https://api.spotify.com/v1/search?query=${artistName}&limit=20&type=artist`;
    return this.http
      .get(url, this.requestOptions)
      .map(response => response.json());
  }

  getArtistsByIds(ids) {
    this._setRequestBearer();
    const url = `https://api.spotify.com/v1/artists?ids=${ids.join(',')}`;
    return this.http
      .get(url, this.requestOptions)
      .map(response => response.json());
  }

  getSavedAlbums(url) {
    this._setRequestBearer();
    url = url || 'https://api.spotify.com/v1/me/albums?offset=0&limit=50';
    return this.http
      .get(url, this.requestOptions)
      .map(response => response.json());
  }

  getSavedTracks(url) {
    this._setRequestBearer();
    url = url || 'https://api.spotify.com/v1/me/tracks?offset=0&limit=50';
    return this.http
      .get(url, this.requestOptions)
      .map(response => response.json());
  }

  authenticateUser() {
    const authUrl = 'https://accounts.spotify.com/authorize';
    const clientId = 'c4848b2344434546a34103f23438226b';
    const scopes = 'playlist-read-private user-library-read user-read-email';
    const redirectUri = window.location.href;
    const url = `${authUrl}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = url;
  }

  parseArtist(artist) {
    const imgIndex = (artist.images.length) ? artist.images.length - 1 : -1;
    return {
      name: artist.name.charAt(0).toUpperCase() + artist.name.slice(1),
      tags: artist.genres.map(tag => ({ name: tag, selected: false })),
      spotifyImg: (imgIndex >= 0) ? artist.images[imgIndex].url : '',
      spotifyUri: artist.uri
    };
  }

  _setRequestBearer() {
    const token = window.localStorage.getItem('spotify-token');
    // const token = 'BQBlCpFvu1OSxKne80MaXGSItyQYhvvPLvUGlyZr70L9cjc7CSfQdsMjcuuSfOfvt3DhM8zXuUxpflZDok5wa9sTWGFmyajEWjmfjFn1u0BNp_skZ61psyotx9cKj1X8mGoONrUDRajUf44';
    const headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', `Bearer ${token}`);
    this.requestOptions = new RequestOptions({ headers });
  }
}
