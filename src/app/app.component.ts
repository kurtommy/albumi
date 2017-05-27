import { Component, OnInit } from '@angular/core';
// import * as firebase from 'firebase';
import { DbService } from './services/index';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private db: DbService) {
    // var config = {
    //   apiKey: "AIzaSyCoELwGXqES03WPHwTWUPnXIVz0SltjCac",
    //   authDomain: "albumi-5815f.firebaseapp.com",
    //   databaseURL: "https://albumi-5815f.firebaseio.com",
    //   projectId: "albumi-5815f",
    //   storageBucket: "albumi-5815f.appspot.com",
    //   messagingSenderId: "773274614121"
    // };
    // const f = firebase.initializeApp(config);
    // firebase.database().ref('users/' + 3).set({
    //   username: 1,
    //   email: 2,
    //   profile_picture : 4
    // });
    // console.info(f);
  }

  ngOnInit() {
    this.db.init();
  }
}