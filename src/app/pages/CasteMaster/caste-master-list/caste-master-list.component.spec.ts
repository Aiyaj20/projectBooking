import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasteMasterListComponent } from './caste-master-list.component';

describe('CasteMasterListComponent', () => {
  let component: CasteMasterListComponent;
  let fixture: ComponentFixture<CasteMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasteMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasteMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
