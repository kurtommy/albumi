import { Injectable } from '@angular/core';
import { DbService } from '../index';
import * as lf from 'lovefield';

@Injectable()
export class TagService {

  constructor(private dbS: DbService) { }

  insertTags(tags) {
    // create tag // check if exist

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
              console.info('tags added', newTags);
              dbTags.push(...newTags[0]);
              return dbTags;
            });
        } else {
          return dbTags;
        }
      });
  }

  getTags(tagsNames) {
    return this.dbS.db.select()
      .from(this.dbS.tagTable)
      .where(this.dbS.tagTable.name.in(tagsNames))
      .exec()
      .then((tags) => {
        console.info('tags founded', tags);
        return tags;
      });

    // return this.dbS.db.createTransaction().exec([
    //   this.dbS.db.insert().into(this.dbS.tagTable).values(newTags)
    // ])
  }

  getAllTags() {
    return new Promise((resolve, reject) => {
      this.dbS.db.select()
          .from(this.dbS.tagTable)
          .orderBy(this.dbS.tagTable.name, lf.Order.ASC)
          .exec()
          .then(results => resolve(results));
    });
  }
}
