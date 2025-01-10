import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutaddComponent } from './layoutadd.component';

describe('LayoutaddComponent', () => {
  let component: LayoutaddComponent;
  let fixture: ComponentFixture<LayoutaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
