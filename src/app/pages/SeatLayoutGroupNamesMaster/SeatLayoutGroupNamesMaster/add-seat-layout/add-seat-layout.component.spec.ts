import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatLayoutComponent } from './add-seat-layout.component';

describe('AddSeatLayoutComponent', () => {
  let component: AddSeatLayoutComponent;
  let fixture: ComponentFixture<AddSeatLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSeatLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSeatLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
