import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdIconModule } from '@angular/material';


import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {
  MdButtonModule, MdCheckboxModule, MdSidenavModule, MdListModule, MdInputModule, MdToolbarModule,
  MdSelectModule, MdMenuModule} from '@angular/material';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AlphabetComponent } from './alphabet/alphabet.component';
import { ArtistsListComponent } from './artists-list/artists-list.component';
import { GeneresComponent } from './generes/generes.component';
import { ArtistMenuComponent } from './artist-menu/artist-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    AlphabetComponent,
    ArtistsListComponent,
    GeneresComponent,
    ArtistMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdSelectModule,
    MdSidenavModule,
    MdListModule,
    MdInputModule,
    MdToolbarModule,
    MdMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
