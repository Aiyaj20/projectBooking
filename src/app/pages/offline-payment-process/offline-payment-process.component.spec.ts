import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePaymentProcessComponent } from './offline-payment-process.component';

describe('OfflinePaymentProcessComponent', () => {
  let component: OfflinePaymentProcessComponent;
  let fixture: ComponentFixture<OfflinePaymentProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflinePaymentProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePaymentProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
