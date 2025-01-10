import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutbuttondetailsComponent } from './layoutbuttondetails.component';

describe('LayoutbuttondetailsComponent', () => {
  let component: LayoutbuttondetailsComponent;
  let fixture: ComponentFixture<LayoutbuttondetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutbuttondetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutbuttondetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
