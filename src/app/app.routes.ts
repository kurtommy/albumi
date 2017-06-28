import { RouterModule, Routes } from '@angular/router';
import { PanelAddArtistComponent } from './panel-add-artist/panel-add-artist.component';
import { PanelArtistsListComponent } from './panel-artists-list/panel-artists-list.component';
import { PanelImportArtistsComponent } from './panel-import-artists/panel-import-artists.component';
import { PanelFavouritesComponent } from './panel-favourites/panel-favourites.component';

const routes: Routes = [
  { path: '', redirectTo: 'artists', pathMatch: 'full' },
  { path: 'artists', component: PanelArtistsListComponent},
  { path: 'add-artist', component: PanelAddArtistComponent },
  { path: 'import-artists', component: PanelImportArtistsComponent },
  { path: 'favourites', component: PanelFavouritesComponent }
];

export const RoutingModule = RouterModule.forRoot(routes);