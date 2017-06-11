import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
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

  constructor(private spotifyS: SpotifyService, private artistS: ArtistService, private tagS: TagService,
      private router: Router, private http: Http) { }

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

  async importFromJson() {
     this.http
      .get(`assets/data/artists.json`)
      .map(response => response.json())
      .subscribe(artists => {
        console.info(artists);
        this.artists = artists;
        this.artists = this.artists.map(artist => artist.name);
        this._fetchAdnSaveSpotyfyArtists()
          .then(() => {
            this.fetchMessage = `Artists added to your DB`;
            this.fetchProgress = 100;
          });
      });
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

  async _fetchAdnSaveSpotyfyArtists() {
    const artistsLen = this.artists.length;
    return new Promise((resolve) => {
      const fetch = (i = 0) => {
        this.fetchMessage = `Searching data for ${this.artists[i]}`;
        this.spotifyS.searchArtist(this.artists[i])
          .subscribe((spotifyArtist) => {
            this.fetchProgress = Math.ceil(i / artistsLen * 100);
            if (spotifyArtist.artists.items && spotifyArtist.artists.items.length) {
              const newArtist: any = this.spotifyS.parseArtist(spotifyArtist.artists.items[0]);
              const tags = this._clusterizeTags(newArtist.genres);
              this.artistS.insertArtist(newArtist)
                .then(artist => {
                  if (tags.length) {
                    this.tagS.insertTags(tags)
                      .then(tagsToLink => {
                        this.artistS.linkTags(artist, tagsToLink);
                      });
                  }
                  if (i < artistsLen - 1) {
                    fetch(i + 1);
                  } else {
                    resolve();
                  }
                }, reason => {
                  console.error('artist already present', reason);
                  if (i < artistsLen - 1) {
                    fetch(i + 1);
                  } else {
                    resolve();
                  }
                });
            } else {
              if (i < artistsLen - 1) {
                fetch(i + 1);
              } else {
                resolve();
              }
            }
          });
      }
      fetch();
    });
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
              processArtist = insertedArtists.slice(0, 50);
              insertedArtists = insertedArtists.splice(50);
              if (!spotifyArtists || spotifyArtists.length === 0) {
                addImgsAndTags(processArtist);
                return;
              }
              const artistsToBeUpdated = spotifyArtists.artists
                .map(artist => {
                  const foundedArtist = artists.find(a => a.spotifyUri === artist.uri);
                  let artistId;
                  if (foundedArtist) {
                    artistId = foundedArtist.id;
                  }
                  return Object.assign({}, this.spotifyS.parseArtist(artist), {id: artistId});
                });
              artistsToBeUpdated.filter(artist => artist.id);
              // console.info(artistsToBeUpdated);

              const tagsPromises = [];
              const updateArtist = async (artist) => {
                // Update artist image
                this.artistS.updateArtist(artist);
                // Create new tags
                let clusterizedTags = artist.tags.map(tag => tag.name);
                clusterizedTags = this._clusterizeTags(clusterizedTags);
                const tags = await this.tagS.insertTags(clusterizedTags);
                // Link artist and tags
                this.artistS.linkTags(artist, tags);

                if (artistsToBeUpdated.length) {
                  updateArtist(artistsToBeUpdated.pop());
                } else {
                  // Re run the method
                  setTimeout(function() {
                    addImgsAndTags(processArtist);
                  }, 1000);
                }
              }
              updateArtist(artistsToBeUpdated.pop());
            },(e) => {
              console.error(e);
              processArtist = insertedArtists.slice(0, 50);
              insertedArtists = insertedArtists.splice(50);
              addImgsAndTags(processArtist);
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

  _clusterizeTags(tags) {
    const clusterizedTags = [];
    tags.forEach((tag, i) => {
      let clusterizedTag = tag;
      if (tag.match(/rap/i)) {
        clusterizedTag = 'rap';
      }
      if (tag.match(/rock/i)) {
        clusterizedTag = 'rock';
      }
      if (tag.match(/grunge/i)) {
        clusterizedTag = 'grunge';
      }
      if (tag.match(/metal/i)) {
        clusterizedTag = 'metal';
      }
      if (tag.match(/gospel/i)) {
        clusterizedTag = 'gospel';
      }
      if (tag.match(/dub/i)) {
        clusterizedTag = 'dub';
      }
      if (tag.match(/dance/i)) {
        clusterizedTag = 'dance';
      }
      if (tag.match(/latin/i)) {
        clusterizedTag = 'latin';
      }
      if (tag.match(/wave/i)) {
        clusterizedTag = 'wave';
      }
      if (tag.match(/ambient/i)) {
        clusterizedTag = 'ambient';
      }
      if (tag.match(/british/i)) {
        clusterizedTag = 'british';
      }
      if (tag.match(/beats/i)) {
        clusterizedTag = 'beats';
      }
      if (tag.match(/psychedelic/i)) {
        clusterizedTag = 'psychedelic';
      }
      if (tag.match(/romantic/i)) {
        clusterizedTag = 'romantic';
      }
      if (tag.match(/house/i)) {
        clusterizedTag = 'house';
      }
      if (tag.match(/techno/i)) {
        clusterizedTag = 'techno';
      }
      if (tag.match(/rap/i)) {
        clusterizedTag = 'techno';
      }
      if (tag.match(/soul/i)) {
        clusterizedTag = 'soul';
      }
      if (tag.match(/folk/i)) {
        clusterizedTag = 'folk';
      }
      if (tag.match(/garage/i)) {
        clusterizedTag = 'garage';
      }
      if (tag.match(/disco/i)) {
        clusterizedTag = 'disco';
      }
      if (tag.match(/swing/i)) {
        clusterizedTag = 'swing';
      }
      if (tag.match(/reggae/i)) {
        clusterizedTag = 'reggae';
      }
      if (tag.match(/funk/i)) {
        clusterizedTag = 'funk';
      }
      if (tag.match(/r&b/i)) {
        clusterizedTag = 'r&b';
      }
      if (tag.match(/blues/i)) {
        clusterizedTag = 'blues';
      }
      if (tag.match(/indie/i)) {
        clusterizedTag = 'indie';
      }
      if (tag.match(/jazz/i)) {
        clusterizedTag = 'jazz';
      }
      if (tag.match(/punk/i)) {
        clusterizedTag = 'punk';
      }
      if (tag.match(/hip hop/i)) {
        clusterizedTag = 'hip hop';
      }
      if (tag.match(/pop/i)) {
        clusterizedTag = 'pop';
      }
      if (!clusterizedTags.find(item => item === clusterizedTag)) {
        clusterizedTags.push(clusterizedTag);
      }
    });
    return clusterizedTags;
  }
}
