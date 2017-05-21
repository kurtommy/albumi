import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.scss']
})
export class AlphabetComponent implements OnInit {
  @Output() newChar = new EventEmitter();
  alphabet = '0abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

  constructor() { }

  ngOnInit() {
  }

  goToChar(char) {
    console.info(char);
    this.newChar.emit({ char });
  }
}
