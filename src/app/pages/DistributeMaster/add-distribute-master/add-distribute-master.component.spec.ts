import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDistributeMasterComponent } from './add-distribute-master.component';

describe('AddDistributeMasterComponent', () => {
  let component: AddDistributeMasterComponent;
  let fixture: ComponentFixture<AddDistributeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDistributeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDistributeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
