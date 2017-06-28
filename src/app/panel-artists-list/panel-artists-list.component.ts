import { Component, OnInit, Inject } from '@angular/core';
import { DbService, ArtistService, TagService } from '../services/index';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';


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

  constructor(private dbS: DbService, public artistS: ArtistService, public tagS: TagService, public dialog: MdDialog) { }

  ngOnInit() {
    this.obs.push(
      this.dbS.dbConnection.subscribe((db) => {
        this._updateArtistsList()
          .then(artists => {
            // console.log(artists);
            // this.artistsList = artists
          });
      })
    );
  }

  selectChar(obj) {
    console.info('sc', obj);
    const char: string = obj.char;
    if (char === 'All') {
      this.artistS.betweenChars = [];
    } else {
      this.artistS.betweenChars = [char , this._getNextChar(char)];
    }
    this._updateArtistsList();
  }


  confirmDeleteArtist(artist) {
    const dialog = this.dialog.open(DeleteArtistDialog, { data: artist });
    dialog.afterClosed().subscribe(artistToDelete => {
      if (artistToDelete) {
        this.deleteArtist(artistToDelete);
      }
    });
  }

  deleteArtist(artist) {
    this.artistS.deleteArtist(artist)
      .then(() => {
        this._updateArtistsList();
      });
  }

  onTagsChange() {
    this._updateArtistsList();
  }

  removeTag(tag) {
    const selectedTagIndex = this.tagS.activeTags.findIndex(t => t.id === tag.id);
    this.tagS.activeTags.splice(selectedTagIndex, 1);
    this._updateArtistsList();
  }

  async _updateArtistsList() {
    this.artistsList = await this.artistS.getArtists({
        tags: this.tagS.activeTags,
        betweenChars: this.artistS.betweenChars
      });
    this.tagS.updateAvailableTags(this.artistsList);
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

@Component({
  selector: 'dialog-delete-artist',
  templateUrl: './dialog-delete-artist.html'
})
export class DeleteArtistDialog {
  constructor(public dialogRef: MdDialogRef<DeleteArtistDialog>, @Inject(MD_DIALOG_DATA) public data: any) {}
}