import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService, ArtistService, TagService } from '../services';

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
  showGoToArtistButton = false;
  fetchMessage;

  constructor(private spotifyS: SpotifyService, private artistS: ArtistService, private tagS: TagService, private router: Router) { }

  ngOnInit() {
    this._checkTokenInUrlParams();
  }

  deleteDb() {
    indexedDB.deleteDatabase('albumi');
  }

  async startImport() {
    this.inFetching = true;
    await this._fetchSavedAlbumsFromSpotify();
    await this._fetchSavedTracksFromSpotify();
    const insertedArtists = await this._storeNewArtists();
    await this._addImgsAndTags(insertedArtists);
    this.inFetching = false;
    this.fetchMessage = 'Fetching complete';
    this.showGoToArtistButton = true;
  }

  async _fetchSavedAlbumsFromSpotify() {
    this.fetchMessage = 'Fetching saved albums from Spotify';
    return new Promise(resolve => {
      const getSavedAlbums = (url = '') => {
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
                getSavedAlbums(albums.next);
              }, 200);
            } else {
              this.fetchProgress = 100;
              resolve();
            }
          });
        };
        getSavedAlbums();
    });
  }

  async _fetchSavedTracksFromSpotify() {
    this.fetchMessage = 'Fetching saved tracks from Spotify';
    return new Promise(resolve => {
      const getSavedTracks = (url = '') => {
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
                getSavedTracks(tracks.next);
              }, 200);
            } else {
              this.fetchProgress = 100;
              resolve();
            }
          });
      };
      getSavedTracks();
    });
  }

  async _storeNewArtists() {
    this.artistsMap = new Map(this.artists);
    this.fetchMessage = `Storing ${this.artistsMap.size} artists in DB`;
    // console.info(this.artistsMap.entries());
    const promises = [];
    this.artistsMap.forEach((artist, index) => {
      // console.log(artist);
      this.fetchProgress = Math.ceil(index / this.artistsMap.size * 100);
      promises.push(this.artistS.insertArtist(artist));
    });
    this.fetchProgress = 100;
    return Promise.all(promises);
  }

  async _addImgsAndTags(insertedArtists) {
    let processArtist;
    const initCounter = insertedArtists.length;
    this.fetchMessage = 'Fetching artist images and tags';
    return new Promise(resolve => {
      // retrieve 50 artists at time
      const addImgsAndTags = (artists) => {
        // Get spotify results
        if (artists.length) {
          this.fetchProgress = Math.ceil((initCounter - insertedArtists.length) / initCounter * 100);
          const artistsIds = artists.map(artist => artist.spotifyUri.split(':')[2]);
          // console.info(artistsIds);
          this.spotifyS.getArtistsByIds(artistsIds)
            .subscribe(spotifyArtists => {
              // console.log(spotifyArtists);
              const artistsToBeUpdated = spotifyArtists.artists
                .map(artist => {
                  const artistId = artists.find(a => a.spotifyUri === artist.uri).id;
                  return Object.assign({}, this.spotifyS.parseArtist(artist), {id: artistId});
                });
              // console.info(artistsToBeUpdated);

              const tagsPromises = [];
              const updateArtist = async (artist) => {
                // Create new tags
                const tags = await this.tagS.insertTags(artist.tags.map(tag => tag.name));
                // Update artist image
                this.artistS.updateArtist(artist);
                // Link artist and tags
                this.artistS.linkTags(artist, tags);

                if (artistsToBeUpdated.length) {
                  updateArtist(artistsToBeUpdated.pop());
                } else {
                  // Re run the method
                  processArtist = insertedArtists.slice(0, 50);
                  insertedArtists = insertedArtists.splice(50);
                  addImgsAndTags(processArtist);
                }
              }
              updateArtist(artistsToBeUpdated.pop());
            });
        } else {
          this.fetchProgress = 0;
          resolve();
        }
      }
      processArtist = insertedArtists.slice(0, 50);
      insertedArtists = insertedArtists.splice(50);
      addImgsAndTags(processArtist);
    });
  }

  _checkTokenInUrlParams() {
    const currentUrl = window.location.href;
    const i = currentUrl.indexOf('access_token=');
    const j = currentUrl.indexOf('&token');
    if (~i && ~j) {
      const token = currentUrl.slice(i, j).replace('access_token=', '');
      window.localStorage.setItem('spotify-token', token);
      this.fetchMessage = 'You are logged on Spotify';
    } else {
      this._checkForValidToken();
    }
  }

  _checkForValidToken() {
    const token = window.localStorage.getItem('spotify-token');
    console.info('token', token);
    if (!token) {
      // Redirect to spotify login page
      this.spotifyS.authenticateUser();
    } else {
      this.fetchMessage = 'You are logged on Spotify';
    }
  }

}
