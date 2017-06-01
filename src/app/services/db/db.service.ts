import { Injectable } from '@angular/core';
import * as lf from 'lovefield';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class DbService {
  db;
  artistTable;
  tagTable;
  tagArtistTable;
  dbConnection = new ReplaySubject();
  schemaBuilder: lf.schema.Builder;

  constructor(private http: Http) {}

  init() {
    console.info('init db');
    this._createSchemaBuilder();
    this._createTables();
    return new Promise((resolve) => {
      this._connectToDb()
        .then(() => {
          console.info('connected');
          this._checkArtists()
            .then(artists => {
              // If no artists init DB
              if (artists.length === 0) {
                console.info('populate DB');
                // this._insertContent()
                //   .then(() => resolve());

                // Empty db
                resolve();
                this.dbConnection.next(this.db);
              } else {
                console.info(artists);
                resolve();
                this.dbConnection.next(this.db);
              }
            });
        });
    });
  }

  // GET functions





  _createSchemaBuilder() {
    this.schemaBuilder = lf.schema.create('albumi', 2);
  }

  _createTables() {
    this.schemaBuilder.createTable('Artist')
      .addColumn('id', lf.Type.INTEGER).addPrimaryKey(['id'], true)
      .addColumn('name', lf.Type.STRING)
      .addColumn('spotifyUri', lf.Type.STRING)
      .addUnique('spotifyUriUnique', ['spotifyUri'])
      .addColumn('spotifyImg', lf.Type.STRING)
      .addNullable(['spotifyUri', 'spotifyImg']);

    this.schemaBuilder.createTable('Tag')
      .addColumn('id', lf.Type.INTEGER).addPrimaryKey(['id'], true)
      .addColumn('name', lf.Type.STRING);

    this.schemaBuilder.createTable('TagArtist')
      .addColumn('id', lf.Type.INTEGER).addPrimaryKey(['id'], true)
      .addColumn('tagId', lf.Type.INTEGER)
      .addColumn('artistId', lf.Type.INTEGER)
      .addForeignKey('tagIdFk', {
        local: 'tagId',
        ref: 'Tag.id',
        action: lf.ConstraintAction.CASCADE,
        timing: lf.ConstraintTiming.IMMEDIATE
      })
      .addForeignKey('artistIdFk', {
        local: 'artistId',
        ref: 'Artist.id',
        action: lf.ConstraintAction.CASCADE,
        timing: lf.ConstraintTiming.IMMEDIATE
      });
    // console.info(this.schemaBuilder.getSchema().tables());
  }

  _connectToDb() {
    return this.schemaBuilder.connect({ storeType: lf.schema.DataStoreType.INDEXED_DB }).then((db) => {
      this.db = db;
      this.artistTable = this.db.getSchema().table('Artist');
      this.tagTable = this.db.getSchema().table('Tag');
      this.tagArtistTable = this.db.getSchema().table('TagArtist');
    });
  }

  _checkArtists() {
    return new Promise<any>((resolve, reject) => {
      this.db.select().from(this.artistTable).limit(1).exec()
        .then((artist) => resolve(artist));
    });
  }

  _insertContent() {
    return new Promise(resolve => {
      this._insertTags()
        .then(() => this._insertArtists())
        .then(() => resolve());
    });
  }

  _insertTags() {
    const tags = ['Pop', 'Chill', 'Hip h', 'Latino', 'Electro', 'Dance', 'Rock', 'Indie', 'Jazz', 'Soul',
      'Classical', 'Kids', 'Reggae', 'Blues', 'Funk', 'Metal', 'Punk', 'RnB', 'Folk', 'Country'];
    const tagsRows = tags.map(tag => this.tagTable.createRow({ name: tag }));

    return new Promise(resolve => {
      this.db.createTransaction().exec([
        this.db.insert().into(this.tagTable).values(tagsRows)
      ])
      .then(() => resolve());
    });
  }

  _insertArtists() {
    return new Promise((resolve) => {
      this.http
        .get(`assets/data/artists.json`)
        .map(response => response.json())
        .subscribe((data) => {
          const rows = data.map(item => this.artistTable.createRow({
            name: item.name,
            spotify_uri: item.spotify_uri
          }));
          this.db.createTransaction().exec([
            this.db.insert().into(this.artistTable).values(rows)
          ])
          .then(() => resolve());
        });
    });
  }

}
