import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelToolbarComponent } from './panel-toolbar.component';

describe('PanelToolbarComponent', () => {
  let component: PanelToolbarComponent;
  let fixture: ComponentFixture<PanelToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
