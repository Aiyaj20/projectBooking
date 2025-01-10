import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowlayoutComponent } from './showlayout.component';

describe('ShowlayoutComponent', () => {
  let component: ShowlayoutComponent;
  let fixture: ComponentFixture<ShowlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowlayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
