import { Component, OnInit } from '@angular/core';
import { SpotifyService, ArtistService } from '../services';

@Component({
  selector: 'app-panel-import-artists',
  templateUrl: './panel-import-artists.component.html',
  styleUrls: ['./panel-import-artists.component.scss']
})
export class PanelImportArtistsComponent implements OnInit {
  artists: any = [];
  artistsMap = new Map();
  fetchProgress = 0;
  inFetching = false;
  fetchMessage;

  constructor(private spotifyS: SpotifyService, private artistS: ArtistService) { }

  ngOnInit() {
    this.fetchMessage = 'Fetching saved albums artists';
    this.fetchSavedAlbumsFromSpotify();
  }

  fetchSavedAlbumsFromSpotify(url = '') {
    this.inFetching = true;
    this.spotifyS.getSavedAlbums(url)
      .subscribe(albums => {
        this.fetchProgress = Math.ceil(albums.offset / albums.total * 100);
        console.log(albums);
        const artists = albums.items
          .map(item => item.album.artists
          .map(artist => ([artist.uri, {name: artist.name, spotifyUri: artist.uri}]) ))
          .forEach(a => {
            // console.log(a);
            this.artists = this.artists.concat(a);
          });
        // this.artists.push([...artists]);
        if (albums.next) {
          setTimeout(() => {
            this.fetchSavedAlbumsFromSpotify(albums.next);
          }, 1000);
        } else {
          this.fetchProgress = 100;
          setTimeout(() => {
            this.fetchProgress = 0;
          }, 300);
          this.fetchMessage = 'Fetching saved tracks artists';
          // this.fetchSavedTracksFromSpotify();
          this._storeNewArtists();
        }
      });
  }

  fetchSavedTracksFromSpotify(url = '') {
    this.spotifyS.getSavedTracks(url)
      .subscribe(tracks => {
        console.log(tracks);
        this.fetchProgress = Math.ceil(tracks.offset / tracks.total * 100);
        const artists = tracks.items
          .map(item => item.track.artists
          .map(artist => ([artist.uri, {name: artist.name, spotifyUri: artist.uri}]) ))
          .forEach(a => {
            // console.log(a);
            this.artists = this.artists.concat(a);
          });
        // this.artists.push([...artists]);
        if (tracks.next) {
          setTimeout(() => {
            this.fetchSavedTracksFromSpotify(tracks.next);
          }, 1000);
        } else {
          setTimeout(() => {
            this.inFetching = false;
          }, 300);
          this.fetchProgress = 100;
          this._storeNewArtists();
          console.log(this.artistsMap);
        }
      });
  }

  _storeNewArtists() {
    this.artistsMap = new Map(this.artists);
    console.info(this.artistsMap.entries());
    this.artistsMap.forEach(artist => {
      console.log(artist);
      this.artistS.insertArtist(artist);
    })
  }
}
