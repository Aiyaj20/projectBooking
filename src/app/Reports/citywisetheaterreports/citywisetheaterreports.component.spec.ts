import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitywisetheaterreportsComponent } from './citywisetheaterreports.component';

describe('CitywisetheaterreportsComponent', () => {
  let component: CitywisetheaterreportsComponent;
  let fixture: ComponentFixture<CitywisetheaterreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitywisetheaterreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitywisetheaterreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
