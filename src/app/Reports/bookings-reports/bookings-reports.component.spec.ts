import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsReportsComponent } from './bookings-reports.component';

describe('BookingsReportsComponent', () => {
  let component: BookingsReportsComponent;
  let fixture: ComponentFixture<BookingsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
