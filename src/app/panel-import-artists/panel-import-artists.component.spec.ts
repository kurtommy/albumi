import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelImportArtistsComponent } from './panel-import-artists.component';

describe('PanelImportArtistsComponent', () => {
  let component: PanelImportArtistsComponent;
  let fixture: ComponentFixture<PanelImportArtistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelImportArtistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelImportArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
