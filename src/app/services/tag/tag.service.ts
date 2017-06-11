import { Injectable } from '@angular/core';
import { DbService } from '../index';
import * as lf from 'lovefield';

@Injectable()
export class TagService {
  activeTags: any = [];
  availableTags: any = [];
  obs = [];

  constructor(private dbS: DbService) {
   this.obs.push(
      this.dbS.dbConnection.subscribe((db) => {
        this._init();
      })
    );
  }

  async _init() {
    // Load all tags
    // TODO load filtered tags..
    // this.tags = await this.getAllTags();
  }

  // get activeTags() {
  //   return this.tags.filter(tag => tag.selected);
  // }

  async updateAvailableTags(artists) {
    this.availableTags = await this.getAllTags(artists);
  }

  insertTags(tags) {
    const dbTags = [];
    // Check for tags already in DB
    return this.getTags(tags)
      .then(tagsInDb => {
        if (tagsInDb.length) {
          dbTags.push(...tagsInDb);
        }

        if (tags.length > tagsInDb.length) {
          // There are new tags to store in DB
          const newTags = tags
            .filter(tag => !tagsInDb.find(t => t.name === tag))
            .map(tag => this.dbS.tagTable.createRow({ name: tag }));

          // Add the new tags
          return this.dbS.db.createTransaction().exec([
              this.dbS.db.insert().into(this.dbS.tagTable).values(newTags)
            ])
            .then((newTags) => {
              // console.info('tags added', newTags);
              dbTags.push(...newTags[0]);
              return dbTags;
            });
        } else {
          return dbTags;
        }
      });
  }

  async getTags(tagsNames) {
    return this.dbS.db.select()
      .from(this.dbS.tagTable)
      .where(this.dbS.tagTable.name.in(tagsNames))
      .exec()
      .then((tags) => {
        // console.info('tags founded', tags);
        return tags;
      });
  }

  async getAllTags(artists = []) {
    const t = this.dbS.tagTable;
    const ta = this.dbS.tagArtistTable;
    return new Promise((resolve, reject) => {
      const q = this.dbS.db.select(t.id, t.name, lf.fn.count(t.id).as('count'));
        if (artists.length) {
          const artistsIds = artists.map(artist => artist.id);
          q.from(t, ta)
          .where(lf.op.and(ta.tagId.eq(t.id), ta.artistId.in(artistsIds)));
        } else {
          q.from(t, ta)
          .where(this.dbS.tagArtistTable.tagId.eq(t.id));
        }
        q.groupBy(t.id)
        .orderBy(t.name, lf.Order.ASC)
        .exec()
        .then(results => {
          results = results.sort((prev, next) => next.count - prev.count);
          // console.info(results);
          resolve(this._mapUiTags(results));
        });
    });
  }

  _mapUiTags(tags) {
    return tags.map((t) => ({
      id: t.Tag.id,
      name: t.Tag.name,
      count: t.count,
      selected: false
    }));
  }
}
