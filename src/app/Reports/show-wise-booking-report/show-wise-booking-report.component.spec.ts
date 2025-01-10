import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWiseBookingReportComponent } from './show-wise-booking-report.component';

describe('ShowWiseBookingReportComponent', () => {
  let component: ShowWiseBookingReportComponent;
  let fixture: ComponentFixture<ShowWiseBookingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowWiseBookingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowWiseBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
