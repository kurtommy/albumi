import { Injectable } from '@angular/core';
import { DbService, TagService } from '../index';
import * as lf from 'lovefield';

@Injectable()
export class ArtistService {

  constructor(private dbS: DbService) { }

  getArtistsBetweenChars(char, nextChar) {
    return new Promise((resolve) => {
      char = char.toUpperCase();
      const a = this.dbS.artistTable;
      const t = this.dbS.tagTable;
      const ta = this.dbS.tagArtistTable;
      this.dbS.db.createTransaction().exec([
        this.dbS.db.select()
          .from(a, t, ta)
          .where(lf.op.and(
            a.name.gte(char),
            a.name.lt(nextChar),
            ta.artistId.eq(a.id),
            ta.tagId.eq(t.id),
            ta.tagId.in([1, 2, 5])
          ))
          // .from(a, t, ta)
          // .where(lf.op.and(
          //     a.name.gte(char),
          //     a.name.lt(nextChar),
          //     ta.artistId.eq(a.id),
          //     ta.tagId.eq(t.id)
          //   ))
          // .groupBy(a.name)
          .orderBy(a.name, lf.Order.ASC)
      ]).then(artists => {
        console.info(artists);
        console.log(artists[0].length);
        resolve(artists[0]);
        // this.artistsList = artists[0];
      });
    });
  }

  // Insert functions
  insertArtist(artist) {
    // Check if the artist already exist in DB
    return new Promise(resolve => {
      this.getArtistByName(artist.name)
        .then(artistFounded => {
          if (artistFounded.length) {
            resolve(artistFounded[0]);
          } else {
            const newArtist = {
              name: artist.name,
              spotifyImg: artist.spotifyImg || null,
              spotifyUri: artist.spotifyUri || null
            };

            this.dbS.db.createTransaction().exec([
              this.dbS.db.insert().into(this.dbS.artistTable).values([
                this.dbS.artistTable.createRow(newArtist)
              ])
            ])
            .then(insertedArtist => resolve(insertedArtist[0][0]));
          }
        });
    });
  }

  getArtistByName(artistName) {
    return this.dbS.db.select()
      .from(this.dbS.artistTable)
      .where(this.dbS.artistTable.name.eq(artistName))
      .exec();
  }

  linkTags(artist, tags) {
    // Get all tags for the artist
    const tagsIds = tags.map(tag => tag.id);
    this.dbS.db.select()
        .from(this.dbS.tagArtistTable)
        .where(lf.op.and(
            this.dbS.tagArtistTable.artistId.eq(artist.id),
            this.dbS.tagArtistTable.tagId.in(tagsIds)))
        .exec()
        .then(tagsLinked => {
          console.log('tagsLinked', tagsLinked);
          // Filter tags to be added
          const tagsToAdd = tags.filter(tag => !tagsLinked.find(t => t.tagId === tag.id));
          if (tagsToAdd.length) {
            this._addTags(artist, tagsToAdd);
          }
        });
  }

  _addTags(artist, tags) {
    const rows = tags.map(tag => this.dbS.tagArtistTable.createRow({
      artistId: artist.id,
      tagId: tag.id
    }));
    return this.dbS.db.createTransaction().exec([
        this.dbS.db.insert().into(this.dbS.tagArtistTable).values(rows)
      ])
      .then(newTagArtist => {
        console.info(newTagArtist);
      });
  }

  // _insertArtistTags(artist) {
  //   if (artist.tags && artist.tags.length) {
  //     // create tag // check if exist
  //     const newTags = artist.tags.map(tag => {
  //       return this.tagTable.createRow({ name: tag });
  //     });
  //     return this.dbS.db.createTransaction().exec([
  //       this.dbS.db.insert().into(this.tagTable).values(newTags)
  //     ])
  //       .then(() => {
  //         console.info('tags added');
  //       });
  //     // Add Artist Tag relation
  //   }
  // }

}
