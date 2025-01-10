import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeMasterComponent } from './distribute-master.component';

describe('DistributeMasterComponent', () => {
  let component: DistributeMasterComponent;
  let fixture: ComponentFixture<DistributeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
