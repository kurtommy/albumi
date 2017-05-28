import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {
  @Input() list;
  @Output() onDelete = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.elementRef.nativeElement.scrollTop = 0;
  }

  deleteArtist(artist) {
    this.onDelete.emit(artist);
  }
}
