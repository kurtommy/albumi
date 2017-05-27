import { Component, OnInit } from '@angular/core';
import { SpotifyService, ArtistService, TagService } from '../services/index';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.scss']
})
export class AddArtistComponent implements OnInit {
  artistName;
  animate;
  newArtist: any = {};
  tags;
  canSave = false;

  constructor(private spotifyS: SpotifyService, private artistS: ArtistService, private tagS: TagService) { }

  ngOnInit() {
  }

  searchArtist(form) {
    console.info(form.value);
    const artistName = form.value.artistName;
    if (artistName) {
      this.animate = true;
      this.spotifyS.searchArtist(artistName)
        .subscribe(response => {
          console.info(response);
          let spotifyArtist = this._parseResponse(response);
          console.info(spotifyArtist);

          // Capitalize the name
          this.newArtist.name = artistName.charAt(0).toUpperCase() + artistName.slice(1);
          if (spotifyArtist.spotifyImg) {
            this.newArtist.spotifyImg = spotifyArtist.spotifyImg;
          }
          if (spotifyArtist.spotifyUri) {
            this.newArtist.spotifyUri = spotifyArtist.spotifyUri;
          }

          // show founded tags
          this.tags = spotifyArtist.tags;

          this.animate = false;
          this.canSave = true;
        });
    }
  }

  saveArtist() {
    this.artistS.insertArtist(this.newArtist)
      .then(artist => {
        console.info(artist);
        // If saved and there are tags save tags
        const tags = this.tags.filter(tag => tag.selected).map(tag => tag.name);
        if (tags.length) {
          this.tagS.insertTags(tags)
            .then(tagsToLink => {
              console.info('tagsToLink', tagsToLink);
              this.artistS.linkTags(artist, tagsToLink);
            });
        }
      });
  }

  _parseResponse(response) {
    if (response.artists.length === 0) {
      return;
    }
    const artist = response.artists.items[0];
    const imgIndex = (artist.images.length - 2 >= 0) ? artist.images.length - 2 : artist.images.length - 1;
    const ret = {
      tags: artist.genres.map(tag => ({ name: tag, selected: false })),
      spotifyImg: artist.images[imgIndex].url,
      spotifyUri: artist.uri
    };
    return ret;
  }

  _addSelectedTagsToDb() {

  }
}
