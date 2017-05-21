import { Component, OnInit } from '@angular/core';
import * as lf from 'lovefield';
import * as firebase from 'firebase';
import { Http } from '@angular/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  folders;
  notes;
  name = 1;
  db;
  artistsList;
  generes;
  schemaBuilder: lf.schema.Builder;
  // lf.schema.create('test', 1);
  constructor(private http: Http) {
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
    this._createSchemaBuilder();
    this._createTables();
    this._connectToDb();
  }

  selectChar(obj) {
    let char: string = obj.char;
    let nextChar: string;
    if (char === '0') {
      nextChar = '9';
    } else {
      nextChar = char.substring(0,char.length - 1) +
          String.fromCharCode(char.charCodeAt(char.length - 1) + 1).toUpperCase();
    }

    const artistTable = this.db.getSchema().table('Artist');
    char = char.toUpperCase();
    this.db.createTransaction().exec([
      this.db.select()
        .from(artistTable)
        .where(lf.op.and(artistTable.name.gte(char), artistTable.name.lt(nextChar)))
        .orderBy(artistTable.name, lf.Order.ASC)
    ]).then(artists => {
      console.log(artists[0].length);
      this.artistsList = artists[0];
     });
  }

  _createSchemaBuilder() {
    this.schemaBuilder = lf.schema.create('albumi', 1);
  }

  _createTables() {
    this.schemaBuilder.createTable('Artist')
        .addColumn('id', lf.Type.INTEGER).addPrimaryKey(['id'], true)
        .addColumn('name', lf.Type.STRING)
        .addColumn('spotify_uri', lf.Type.STRING)
        .addColumn('genere_id', lf.Type.INTEGER)
        .addForeignKey('genere_fk', {
          local: 'genere_id',
          ref: 'Genere.id',
          action: lf.ConstraintAction.RESTRICT,
          timing: lf.ConstraintTiming.DEFERRABLE
        });

    this.schemaBuilder.createTable('Genere')
        .addColumn('id', lf.Type.INTEGER).addPrimaryKey(['id'], true)
        .addColumn('name', lf.Type.STRING);
    // console.info(this.schemaBuilder.getSchema().tables());
  }

  _connectToDb() {
    this.schemaBuilder.connect({storeType: lf.schema.DataStoreType.INDEXED_DB}).then((db) => {
      this.db = db;

      this._fetchDb().then(
        this._bindDataToUI.bind(this),
        reason => {
          this._insertContent().then(this._bindDataToUI.bind(this));
      });
    });
  }

  _bindDataToUI(data) {
    this.artistsList = data.artists;
    this.generes = data.generes;
  }

  _fetchDb() {
    const artistTable = this.db.getSchema().table('Artist');
    const genereTable = this.db.getSchema().table('Genere');
    return new Promise((resolve, reject) => {
      this.db.createTransaction().exec([
          this.db.select()
              .from(artistTable)
              .where(artistTable.name.between('A', 'B'))
              .orderBy(artistTable.name, lf.Order.ASC),
          this.db.select()
              .from(genereTable)
              .orderBy(genereTable.name, lf.Order.ASC)
        ]).then(results => {
          if (results[0].length) {
            // console.info('artists', results[0].length);
            resolve({artists: results[0], generes: results[1]});
          } else {
            reject('no artists');
          }
        });
    });
  }

  _insertContent() {
    let content: any;
    return new Promise(resolve => {
      this._insertGeneres()
        .then(generes => content = { generes })
        .then(() => this._insertArtists()
          .then(artists => {
            content.artists = artists;
            resolve(content);
          }));
    });
  }

  _insertGeneres() {
    const genereTable = this.db.getSchema().table('Genere');
    const generes = ['Pop', 'Chill', 'Hip h', 'Latino', 'Electro', 'Dance', 'Rock', 'Indie', 'Jazz', 'Soul',
      'Classical', 'Kids', 'Reggae', 'Blues', 'Funk', 'Metal', 'Punk', 'RnB', 'Folk', 'Country'];
    const generesRows = generes.map(genere => genereTable.createRow({name: genere}));

    return new Promise(resolve => {
      this.db.createTransaction().exec([
        this.db.insert().into(genereTable).values(generesRows)
      ]).then(() => {
        return this.db.createTransaction().exec([
            this.db.select()
              .from(genereTable)
              .orderBy(genereTable.name, lf.Order.ASC)
        ]);
      }).then((results) => {
        console.log('generes', results[0]);
        resolve(results[0]);
      });
    });
  }

  _insertArtists() {
    const artistTable = this.db.getSchema().table('Artist');
    return new Promise((resolve) => {
      this.http
        .get(`assets/data/artists.json`)
        .map(response => response.json())
        .subscribe((data) => {
          const rows = data.map(item => artistTable.createRow({
            name: item.name,
            spotify_uri: item.spotify_uri,
            genere_id: 1
          }));
          this.db.createTransaction().exec([
            this.db.insert().into(artistTable).values(rows)
          ]).then(() => {
            return this.db.createTransaction().exec([
              this.db.select()
                .from(artistTable)
                .where(artistTable.name.between('A', 'B'))
                .orderBy(artistTable.name, lf.Order.ASC)
            ]);
          }).then((results) => {
            console.log('artists', results[0]);
            resolve(results[0]);
          });
        });
    });
  }

  onSubmit(form) {
    console.info(form.value);
    var Product = this.db.getSchema().table('Product');
    this.db.createTransaction().exec([
      this.db.insert().into(Product).values([
        Product.createRow({
          id: 3,
          product_type_id: 1,
          name: form.value.name
        }),
      ])
    ]).then(() => {

      }, (e) => {
        console.info(e);
      });

   }
}
