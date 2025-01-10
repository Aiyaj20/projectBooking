import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDramaComponent } from './add-drama.component';

describe('AddDramaComponent', () => {
  let component: AddDramaComponent;
  let fixture: ComponentFixture<AddDramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
