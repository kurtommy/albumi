import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistMenuComponent } from './artist-menu.component';

describe('ArtistMenuComponent', () => {
  let component: ArtistMenuComponent;
  let fixture: ComponentFixture<ArtistMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
