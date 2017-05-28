import { Component, OnInit } from '@angular/core';
import { DbService, ArtistService } from '../services/index';


@Component({
  selector: 'app-panel-artists-list',
  templateUrl: './panel-artists-list.component.html',
  styleUrls: ['./panel-artists-list.component.scss']
})
export class PanelArtistsListComponent implements OnInit {
  artistsList;
  obs = [];
  showTags = false;
  selectedTags = [];
  betweenChars = ['A', 'B'];

  constructor(private dbS: DbService, private artistS: ArtistService) { }

  ngOnInit() {
    this.obs.push(
      this.dbS.dbConnection.subscribe((db) => {
        this._updateArtistsList()
          .then(artists => {
            console.log(artists);
            // this.artistsList = artists
          });
      })
    );
  }

  selectChar(obj) {
    const char: string = obj.char;
    if (char === 'All') {
      this.betweenChars = [];
    } else {
      this.betweenChars = [char , this._getNextChar(char)];
    }
    this._updateArtistsList();
  }

  updateTagsFilter(obj) {
    console.log(obj);
    this.selectedTags = obj.tags;
    this._updateArtistsList();
  }

  deleteArtist(obj) {
    this.artistS.deleteArtist(obj.artist)
      .then(() => {
        this._updateArtistsList();
      });
  }

  _updateArtistsList() {
    return this.artistS.getArtists({
        tags: this.selectedTags,
        betweenChars: this.betweenChars
      }).then(artists => this.artistsList = artists);
  }

  _getNextChar(char) {
    if (char === '0') {
      return '9';
    }
    return char.substring(0, char.length - 1) +
      String.fromCharCode(char.charCodeAt(char.length - 1) + 1).toUpperCase();
  }

  ngOnDestroy() {
    console.info('destroy artists list panel');
    this.obs.forEach(ob => {
      ob.unsubscribe();
    });
  }
}
