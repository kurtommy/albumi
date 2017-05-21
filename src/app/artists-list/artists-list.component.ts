import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {
  @Input() list;
  constructor() { }

  ngOnInit() {
  }

}
