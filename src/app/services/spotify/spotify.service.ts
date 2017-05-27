import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class SpotifyService {

  constructor(private http: Http) {}

  searchArtist(artistName) {
    const url = `https://api.spotify.com/v1/search?query=${artistName}&limit=20&type=artist`;
    return this.http
      .get(url)
      .map(response => response.json());
  }
}
