import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelFavouritesComponent } from './panel-favourites.component';

describe('PanelFavouritesComponent', () => {
  let component: PanelFavouritesComponent;
  let fixture: ComponentFixture<PanelFavouritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelFavouritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
