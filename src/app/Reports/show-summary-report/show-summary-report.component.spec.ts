import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSummaryReportComponent } from './show-summary-report.component';

describe('ShowSummaryReportComponent', () => {
  let component: ShowSummaryReportComponent;
  let fixture: ComponentFixture<ShowSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
