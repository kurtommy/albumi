import { Component, OnInit } from '@angular/core';
import { SpotifyService, ArtistService, TagService } from '../services/index';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.scss']
})
export class AddArtistComponent implements OnInit {
  artistName;
  spotifyFetching = false;
  newArtists: any = [];
  artistIndex = 0;
  tags;
  canSave = false;
  showAddCustomTag = false;
  customTag = '';

  constructor(private spotifyS: SpotifyService, private artistS: ArtistService, private tagS: TagService) { }

  ngOnInit() {
  }

  searchArtist(form) {
    console.info(form.value);
    const artistName = form.value.artistName;
    if (artistName) {
      this.spotifyFetching = true;
      this.spotifyS.searchArtist(artistName)
        .subscribe(response => {
          console.info(response);
          this.newArtists = this._parseResponse(response);
          console.info(this.newArtists);

          // Capitalize the name
          // this.newArtist.name = artistName.charAt(0).toUpperCase() + artistName.slice(1);
          // if (spotifyArtist.spotifyImg) {
          //   this.newArtist.spotifyImg = spotifyArtist.spotifyImg;
          // }
          // if (spotifyArtist.spotifyUri) {
          //   this.newArtist.spotifyUri = spotifyArtist.spotifyUri;
          // }

          // show founded tags
          // this.tags = spotifyArtist.tags;

          this.spotifyFetching = false;
          this.canSave = true;
        });
    }
  }

  saveArtist() {
    const newArtist = this.newArtists[this.artistIndex];
    this.artistS.insertArtist(newArtist)
      .then(artist => {
        console.info(artist);
        // If saved and there are tags save tags
        const tags = newArtist.tags.filter(tag => tag.selected).map(tag => tag.name);
        if (tags.length) {
          this.tagS.insertTags(tags)
            .then(tagsToLink => {
              console.info('tagsToLink', tagsToLink);
              this.artistS.linkTags(artist, tagsToLink);
            });
        }
        this.newArtists = [];
        this.artistIndex = 0;
        this.artistName = '';
      }, reason => {
        console.error('artist already present', reason);
      });
  }

  addCustomTag() {
    this.newArtists[this.artistIndex].tags.push({name: this.customTag, selected: true});
    this.showAddCustomTag = false;
    this.customTag = '';
  }

  _parseResponse(response) {
    if (response.artists.length === 0) {
      return;
    }
    const ret = response.artists.items.map(artist => {
      const imgIndex =  (artist.images.length) ? artist.images.length - 1 : -1;
      return {
        name: artist.name.charAt(0).toUpperCase() + artist.name.slice(1),
        tags: artist.genres.map(tag => ({ name: tag, selected: false })),
        spotifyImg: (imgIndex >= 0) ? artist.images[imgIndex].url : '',
        spotifyUri: artist.uri
      };
    });
    return ret;
  }
}
