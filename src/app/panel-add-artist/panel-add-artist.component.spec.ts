import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAddArtistComponent } from './panel-add-artist.component';

describe('PanelAddArtistComponent', () => {
  let component: PanelAddArtistComponent;
  let fixture: ComponentFixture<PanelAddArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelAddArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAddArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
