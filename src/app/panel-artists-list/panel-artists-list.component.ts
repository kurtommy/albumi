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

  constructor(private dbS: DbService, private artistS: ArtistService) { }

  ngOnInit() {
    this.obs.push(
      this.dbS.dbConnection.subscribe((db) => {
        this.artistS.getArtistsBetweenChars('A', 'B')
          .then(artists => this.artistsList = artists);
      })
    );
  }

  selectChar(obj) {
    const char: string = obj.char;
    let nextChar: string;
    if (char === '0') {
      nextChar = '9';
    } else {
      nextChar = char.substring(0, char.length - 1) +
        String.fromCharCode(char.charCodeAt(char.length - 1) + 1).toUpperCase();
    }

    this.artistS.getArtistsBetweenChars(char, nextChar)
      .then(artists => this.artistsList = artists);
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.info('destroy artists list panel');
    this.obs.forEach(ob => {
      ob.unsubscribe();
    });
  }
}
