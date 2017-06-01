import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private spotifyS: SpotifyService, private artistS: ArtistService, private router: Router) { }

  ngOnInit() {
    this.fetchMessage = 'Fetching saved albums artists';
    // this._fetchSavedAlbumsFromSpotify();
    this._checkTokenInUrlParams();
  }

  startImport() {
    this._fetchSavedAlbumsFromSpotify();
  }

  addImgsAndTags(skip = 0, limit = 50) {
    return new Promise(resolve => {
      // retrieve 50 artists at time
      this.artistS.getArtistsToAddImgsAndTags(skip, limit)
        .then(artists => {
          // Get spotify results
          if (artists.length) {
            const artistsIds = artists.map(artist => artist.spotifyUri.split(':')[2]);
            // console.info(artistsIds);
            this.spotifyS.getArtistsByIds(artistsIds)
              .subscribe(spotifyArtists => {
                console.log(spotifyArtists);
                const artistsToBeUpdated = spotifyArtists.artists.map(artist => this.spotifyS.parseArtist(artist));
                console.info(artistsToBeUpdated);

                // Update the artists
                artistsToBeUpdated.forEach(artist => {
                  this.artistS.updateArtist(artist);
                });

                return this.addImgsAndTags(skip + limit);
              });
          } else {
            resolve();
          }
        });
    })
  }

  _fetchSavedAlbumsFromSpotify(url = '') {
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
            this._fetchSavedAlbumsFromSpotify(albums.next);
          }, 500);
        } else {
          this.fetchProgress = 100;
          setTimeout(() => {
            this.fetchProgress = 0;
          }, 300);
          this.fetchMessage = 'Fetching saved tracks artists';
          this._fetchSavedTracksFromSpotify();
          // this._storeNewArtists();
        }
      });
  }

  _fetchSavedTracksFromSpotify(url = '') {
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
            this._fetchSavedTracksFromSpotify(tracks.next);
          }, 500);
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
    });
    // Redirect to artist list
    this.addImgsAndTags()
      .then(() => {
        this.router.navigate(['/artists']);
      });
  }

  _checkTokenInUrlParams() {
    const currentUrl = window.location.href;
    const i = currentUrl.indexOf('access_token=');
    const j = currentUrl.indexOf('&token');
    if (~i && ~j) {
      const token = currentUrl.slice(i, j).replace('access_token=', '');
      window.localStorage.setItem('spotify-token', token);
      this._fetchSavedAlbumsFromSpotify();
    } else {
      this._checkForValidToken();
    }
  }

  _checkForValidToken() {
    const token = window.localStorage.getItem('spotify-token');
    if (!token) {
      // Redirect to spotify login page
      this.spotifyS.authenticateUser();
    } else {
      this.fetchMessage = 'You are logged on spotify';
    }
  }

}
