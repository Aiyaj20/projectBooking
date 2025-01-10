import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterwiseshowreportsComponent } from './theaterwiseshowreports.component';

describe('TheaterwiseshowreportsComponent', () => {
  let component: TheaterwiseshowreportsComponent;
  let fixture: ComponentFixture<TheaterwiseshowreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheaterwiseshowreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheaterwiseshowreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
