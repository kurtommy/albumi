import { Injectable } from '@angular/core';
import { DbService } from '../index';
import * as lf from 'lovefield';


@Injectable()
export class FavouriteService {

  constructor(private dbS: DbService) { }

  async getFavourites() {
    return this.dbS.db.select()
      .from(this.dbS.f, this.dbS.a)
      .where(this.dbS.f.artistId.eq(this.dbS.a.id))
      .orderBy(this.dbS.a.name, lf.Order.ASC)
      .exec()
      .then((artists) => {
        // console.info('tags founded', tags);
        return artists;
    });
  }

  async toggle(item) {
    if (item.Favourite.id) {
      this._removeArtist(item);
    } else {
      this._addArtist(item);
    }
  }

  _addArtist(item) {
    const newFavourite = {
      artistId: item.Artist.id
    };
    return this.dbS.db.createTransaction().exec([
      this.dbS.db.insert().into(this.dbS.favouriteTable).values([
        this.dbS.favouriteTable.createRow(newFavourite)
      ])
    ]);
  }

  _removeArtist(item) {
    return this.dbS.db.delete()
      .from(this.dbS.f)
      .where(this.dbS.f.id.eq(item.Favourite.id))
      .exec();
  }
}
