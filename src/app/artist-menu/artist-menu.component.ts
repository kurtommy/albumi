import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ArtistService } from '../services';

@Component({
  selector: 'app-artist-menu',
  templateUrl: './artist-menu.component.html',
  styleUrls: ['./artist-menu.component.scss']
})
export class ArtistMenuComponent implements OnInit {
  @Input() artist;
  @Output() onDelete = new EventEmitter();


  constructor(private artistS: ArtistService) { }

  ngOnInit() {
  }

  openOnSpotify() {
    window.location.href = this.artist.spotifyUri;
  }

  openOnYoutube() {
    window.open(`https://www.youtube.com/results?search_query=${this.artist.name}`);
  }

  openOnLastFm() {
    window.open(`https://www.last.fm/search?q=${this.artist.name}`);
  }

  deleteArtist() {
    this.onDelete.emit({ artist: this.artist })
  }
}
