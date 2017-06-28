import { Component, OnInit } from '@angular/core';
import { FavouriteService, DbService } from '../services/index';

@Component({
  selector: 'app-panel-favourites',
  templateUrl: './panel-favourites.component.html',
  styleUrls: ['./panel-favourites.component.scss']
})
export class PanelFavouritesComponent implements OnInit {
  obs: any = [];
  artistsList;

  constructor(private favouriteS: FavouriteService, private dbS: DbService) { }

  ngOnInit() {
    this.obs.push(
      this.dbS.dbConnection.subscribe((db) => {
        this.favouriteS.getFavourites()
          .then(artists => {
            console.log(artists);
            this.artistsList = artists;
          });
      })
    );
  }

}
