import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OncomingComponent } from './oncoming.component';

describe('OncomingComponent', () => {
  let component: OncomingComponent;
  let fixture: ComponentFixture<OncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OncomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
