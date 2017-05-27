import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelArtistsListComponent } from './panel-artists-list.component';

describe('PanelArtistsListComponent', () => {
  let component: PanelArtistsListComponent;
  let fixture: ComponentFixture<PanelArtistsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelArtistsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelArtistsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
