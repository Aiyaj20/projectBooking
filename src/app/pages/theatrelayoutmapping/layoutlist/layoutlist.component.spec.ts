import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutlistComponent } from './layoutlist.component';

describe('LayoutlistComponent', () => {
  let component: LayoutlistComponent;
  let fixture: ComponentFixture<LayoutlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
