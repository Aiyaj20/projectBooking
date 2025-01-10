import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitywiseshowrreportsComponent } from './citywiseshowrreports.component';

describe('CitywiseshowrreportsComponent', () => {
  let component: CitywiseshowrreportsComponent;
  let fixture: ComponentFixture<CitywiseshowrreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitywiseshowrreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitywiseshowrreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
