import { Injectable } from '@angular/core';
import { DbService, TagService } from '../index';
import * as lf from 'lovefield';

@Injectable()
export class ArtistService {

  constructor(private dbS: DbService) { }

  getArtists(options) {
    return new Promise((resolve) => {
      const a = this.dbS.artistTable;
      const t = this.dbS.tagTable;
      const ta = this.dbS.tagArtistTable;

      const q = this.dbS.db.select();
      if (options.tags.length) {
        q.from(a, ta);
      } else {
        q.from(a);
      }

      // Handle where contitions
      const whereConditions = [];
      if (options.betweenChars.length) {
        whereConditions.push(a.name.gte(options.betweenChars[0].toUpperCase()));
        whereConditions.push(a.name.lt(options.betweenChars[1].toUpperCase()));
      }
      if (options.tags.length) {
        whereConditions.push(ta.tagId.in(options.tags.map(tag => tag.id)));
        whereConditions.push(ta.artistId.eq(a.id));
      }
      if (whereConditions.length) {
        q.where(lf.op.and.apply(null, whereConditions));
      }
      q.orderBy(a.name, lf.Order.ASC)
      .exec()
      .then(artists => {
        if (options.tags.length) {
          artists = artists.map(artist => artist.Artist);
        }
        console.info(artists);
        console.log(artists.length);
        resolve(artists);
        // this.artistsList = artists[0];
      });
    });
  }

  // Insert functions
  insertArtist(artist) {
    // Check if the artist already exist in DB
    return new Promise((resolve, reject) => {
      this.getArtistByName(artist.name)
        .then(artistFounded => {
          if (artistFounded.length) {
            reject(artistFounded[0]);
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

  deleteArtist(artist) {
    const a = this.dbS.artistTable;
    return this.dbS.db.delete()
      .from(a)
      .where(a.id.eq(artist.id))
      .exec();
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
