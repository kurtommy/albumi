import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneresComponent } from './generes.component';

describe('GeneresComponent', () => {
  let component: GeneresComponent;
  let fixture: ComponentFixture<GeneresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
