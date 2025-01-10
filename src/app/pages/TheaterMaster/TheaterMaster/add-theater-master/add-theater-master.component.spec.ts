import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTheaterMasterComponent } from './add-theater-master.component';

describe('AddTheaterMasterComponent', () => {
  let component: AddTheaterMasterComponent;
  let fixture: ComponentFixture<AddTheaterMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTheaterMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTheaterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
