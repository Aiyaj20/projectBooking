import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmReportComponent } from './booking-confirm-report.component';

describe('BookingConfirmReportComponent', () => {
  let component: BookingConfirmReportComponent;
  let fixture: ComponentFixture<BookingConfirmReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingConfirmReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingConfirmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
