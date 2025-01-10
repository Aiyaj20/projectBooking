import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCasteComponent } from './add-caste.component';

describe('AddCasteComponent', () => {
  let component: AddCasteComponent;
  let fixture: ComponentFixture<AddCasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCasteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
