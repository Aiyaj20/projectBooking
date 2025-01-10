import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutbuttonComponent } from './layoutbutton.component';

describe('LayoutbuttonComponent', () => {
  let component: LayoutbuttonComponent;
  let fixture: ComponentFixture<LayoutbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
