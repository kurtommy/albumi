import { Injectable } from '@angular/core';
import * as lf from 'lovefield';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class DbService {
  db;
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

  getArtistsBetweenChars(char, nextChar) {
    return new Promise((resolve) => {
      const artistTable = this.db.getSchema().table('Artist');
      char = char.toUpperCase();
      this.db.createTransaction().exec([
        this.db.select()
          .from(artistTable)
          .where(lf.op.and(artistTable.name.gte(char), artistTable.name.lt(nextChar)))
          .orderBy(artistTable.name, lf.Order.ASC)
      ]).then(artists => {
        console.log(artists[0].length);
        resolve(artists[0]);
        // this.artistsList = artists[0];
      });
    });
  }

  getTags() {
    const tagTable = this.db.getSchema().table('Tag');
    return new Promise((resolve, reject) => {
      this.db.select()
          .from(tagTable)
          .orderBy(tagTable.name, lf.Order.ASC)
          .exec()
          .then(results => resolve(results));
    });
  }

  // Insert functions
  insertArtist(artist) {
    const Artist = this.db.getSchema().table('Artist');
    const newArtist = {
      name: artist.name,
      spotifyImg: artist.spotifyImg || null,
      spotifyUri: artist.spotifyUri || null
    };

    return this.db.createTransaction().exec([
      this.db.insert().into(Artist).values([
        Artist.createRow(newArtist)
      ])
    ])
    .then((insertedArtist) => {
      // Add tags
      this._insertArtistTags(artist);
      return insertedArtist;
    });
  }

  _insertArtistTags(artist) {
    if (artist.tags && artist.tags.length) {
      const Tag = this.db.getSchema().table('Tag');
      // create tag // check if exist
      const newTags = artist.tags.map(tag => {
        return Tag.createRow({ name: tag });
      });
      return this.db.createTransaction().exec([
        this.db.insert().into(Tag).values(newTags)
      ])
      .then(() => {
        console.info('tags added');
      });
      // Add Artist Tag relation
    }
  }

  _createSchemaBuilder() {
    this.schemaBuilder = lf.schema.create('albumi', 2);
  }

  _createTables() {
    this.schemaBuilder.createTable('Artist')
      .addColumn('id', lf.Type.INTEGER).addPrimaryKey(['id'], true)
      .addColumn('name', lf.Type.STRING)
      .addColumn('spotifyUri', lf.Type.STRING)
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
        action: lf.ConstraintAction.RESTRICT,
        timing: lf.ConstraintTiming.DEFERRABLE
      })
      .addForeignKey('artistIdFk', {
        local: 'artistId',
        ref: 'Artist.id',
        action: lf.ConstraintAction.RESTRICT,
        timing: lf.ConstraintTiming.DEFERRABLE
      });
    // console.info(this.schemaBuilder.getSchema().tables());
  }

  _connectToDb() {
    return this.schemaBuilder.connect({ storeType: lf.schema.DataStoreType.INDEXED_DB }).then((db) => {
      this.db = db;
    });
  }

  _checkArtists() {
    const artistTable = this.db.getSchema().table('Artist');
    return new Promise<any>((resolve, reject) => {
      this.db.select().from(artistTable).limit(1).exec()
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
    const tagTable = this.db.getSchema().table('Tag');
    const tags = ['Pop', 'Chill', 'Hip h', 'Latino', 'Electro', 'Dance', 'Rock', 'Indie', 'Jazz', 'Soul',
      'Classical', 'Kids', 'Reggae', 'Blues', 'Funk', 'Metal', 'Punk', 'RnB', 'Folk', 'Country'];
    const tagsRows = tags.map(tag => tagTable.createRow({ name: tag }));

    return new Promise(resolve => {
      this.db.createTransaction().exec([
        this.db.insert().into(tagTable).values(tagsRows)
      ])
      .then(() => resolve());
      // .then(() => {
      //   return this.db.createTransaction().exec([
      //     this.db.select()
      //       .from(tagTable)
      //       .orderBy(tagTable.name, lf.Order.ASC)
      //   ]);
      // }).then((results) => {
      //   console.log('tags', results[0]);
      //   resolve(results[0]);
      // });
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
            spotify_uri: item.spotify_uri
          }));
          this.db.createTransaction().exec([
            this.db.insert().into(artistTable).values(rows)
          ])
          .then(() => resolve());
          // .then(() => {
          //   return this.db.createTransaction().exec([
          //     this.db.select()
          //       .from(artistTable)
          //       .where(artistTable.name.between('A', 'B'))
          //       .orderBy(artistTable.name, lf.Order.ASC)
          //   ]);
          // }).then((results) => {
          //   console.log('artists', results[0]);
          //   resolve(results[0]);
          // });
        });
    });
  }

}
