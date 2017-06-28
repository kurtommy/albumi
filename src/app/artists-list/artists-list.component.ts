import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, EventEmitter, Output } from '@angular/core';
import { FavouriteService } from '../services/index';

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {
  @Input() list;
  @Output() onDelete = new EventEmitter();

  constructor(private elementRef: ElementRef, private favouriteS: FavouriteService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.elementRef.nativeElement.scrollTop = 0;
    console.info(this.list);
  }

  toggleFavourite(artist) {
    console.log(artist);
    this.favouriteS.toggle(artist);
  }

  deleteArtist(artist) {
    this.onDelete.emit(artist);
  }
}
