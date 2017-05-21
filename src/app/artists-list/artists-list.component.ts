import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {
  @Input() list;
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.elementRef.nativeElement.scrollTop = 0;
  }
}
