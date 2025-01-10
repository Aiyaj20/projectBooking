import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeataddComponent } from './seatadd.component';

describe('SeataddComponent', () => {
  let component: SeataddComponent;
  let fixture: ComponentFixture<SeataddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeataddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeataddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
