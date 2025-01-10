import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategogyWiseReportComponent } from './categogy-wise-report.component';

describe('CategogyWiseReportComponent', () => {
  let component: CategogyWiseReportComponent;
  let fixture: ComponentFixture<CategogyWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategogyWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategogyWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
