import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityyyComponent } from './cityyy.component';

describe('CityyyComponent', () => {
  let component: CityyyComponent;
  let fixture: ComponentFixture<CityyyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityyyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityyyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
