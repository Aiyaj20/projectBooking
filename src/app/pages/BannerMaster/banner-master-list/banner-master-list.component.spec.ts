import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerMasterListComponent } from './banner-master-list.component';

describe('BannerMasterListComponent', () => {
  let component: BannerMasterListComponent;
  let fixture: ComponentFixture<BannerMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
