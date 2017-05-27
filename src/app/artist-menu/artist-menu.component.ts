import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-artist-menu',
  templateUrl: './artist-menu.component.html',
  styleUrls: ['./artist-menu.component.scss']
})
export class ArtistMenuComponent implements OnInit {
  @Input() artist;
  constructor() { }

  ngOnInit() {
  }

  openOnSpotify() {
    window.location.href = this.artist.spotifyUri;
  }

  delete() {

  }
}
