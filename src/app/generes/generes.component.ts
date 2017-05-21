import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generes',
  templateUrl: './generes.component.html',
  styleUrls: ['./generes.component.scss']
})
export class GeneresComponent implements OnInit {
  @Input() list;

  constructor() { }

  ngOnInit() {
  }

}
