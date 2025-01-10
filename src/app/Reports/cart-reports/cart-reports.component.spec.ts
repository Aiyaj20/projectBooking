import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartReportsComponent } from './cart-reports.component';

describe('CartReportsComponent', () => {
  let component: CartReportsComponent;
  let fixture: ComponentFixture<CartReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
