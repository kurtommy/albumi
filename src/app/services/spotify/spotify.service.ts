import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class SpotifyService {
  requestOptions;
  token = 'BQBblk95StNAJl0lJ1TlhuCzPNoc0d--6M3Svzav6dSyOacSe2Jv8Hw22GXcmYcqMP__4mUcT5HwNK64Pz2BKKEz9cC76LQ_mdAfSc66xBBlyIfJtwGF355DMsKNcYDIH1T0u31GozBsGK_3bGlfSw6V970WEpaHE1x0koaSe2UInpCLT1Yn20z0awU22Kq8-knMWn9vScedC2ITBzQ';
  constructor(private http: Http) {
    const headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', `Bearer ${this.token}`);
    this.requestOptions = new RequestOptions({ headers });
  }

  searchArtist(artistName) {
    const url = `https://api.spotify.com/v1/search?query=${artistName}&limit=20&type=artist`;
    return this.http
      .get(url, this.requestOptions)
      .map(response => response.json());
  }

  getSavedAlbums(url) {
    url = url || 'https://api.spotify.com/v1/me/albums?offset=0&limit=50';
    return this.http
      .get(url, this.requestOptions)
      .map(response => response.json());
  }

  getSavedTracks(url) {
    url = url || 'https://api.spotify.com/v1/me/tracks?offset=0&limit=50';
    return this.http
      .get(url, this.requestOptions)
      .map(response => response.json());
  }
}
