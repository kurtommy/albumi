import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.scss']
})
export class AlphabetComponent implements OnInit {
  debouncer = new Subject();

  @Output() newChar = new EventEmitter();

  alphabet = '0abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

  constructor() { }

  ngOnInit() {
    this.debouncer.debounceTime(200).subscribe((char) => {
      // console.info(char);
      this.newChar.emit({ char });
    });
  }

  goToChar(char) {
    this.debouncer.next(char);
  }
}
