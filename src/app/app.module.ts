import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import {
  MdButtonModule, MdCheckboxModule, MdSidenavModule, MdListModule, MdInputModule, MdToolbarModule,
  MdSelectModule, MdMenuModule, MdChipsModule, MdIconModule, MdProgressSpinnerModule, MdCardModule,
  MdDialogModule } from '@angular/material';

// Services
import * as services from './services/index';

import { RoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AlphabetComponent } from './alphabet/alphabet.component';
import { ArtistsListComponent } from './artists-list/artists-list.component';
import { GeneresComponent } from './generes/generes.component';
import { ArtistMenuComponent } from './artist-menu/artist-menu.component';
import { PanelToolbarComponent } from './panel-toolbar/panel-toolbar.component';
import { AddArtistComponent } from './add-artist/add-artist.component';
import { PanelAddArtistComponent } from './panel-add-artist/panel-add-artist.component';
import { PanelArtistsListComponent, DeleteArtistDialog } from './panel-artists-list/panel-artists-list.component';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    AlphabetComponent,
    ArtistsListComponent,
    GeneresComponent,
    ArtistMenuComponent,
    PanelToolbarComponent,
    AddArtistComponent,
    PanelAddArtistComponent,
    PanelArtistsListComponent,
    TagsComponent,
    DeleteArtistDialog
  ],
  entryComponents: [
    DeleteArtistDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    RoutingModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdSelectModule,
    MdSidenavModule,
    MdListModule,
    MdInputModule,
    MdToolbarModule,
    MdMenuModule,
    MdChipsModule,
    MdProgressSpinnerModule,
    MdCardModule,
    MdDialogModule
  ],
  providers: [
    services.DbService,
    services.SpotifyService,
    services.ArtistService,
    services.TagService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
