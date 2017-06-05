import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.scss']
})
export class AlphabetComponent implements OnInit {
  @Input() initChar;
  @Output() newChar = new EventEmitter();
  debouncer = new Subject();
  selectedChar;
  alphabet;

  constructor() {
    this.alphabet = '0abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    this.alphabet.unshift('All');
  }

  ngOnInit() {
    this.selectedChar = this.initChar || 'A';
    this.debouncer.debounceTime(200).subscribe((char: any) => {
      this.selectedChar = char;
      this.newChar.emit({ char });
    });
  }

  goToChar(char) {
    this.debouncer.next(char);
  }
}
