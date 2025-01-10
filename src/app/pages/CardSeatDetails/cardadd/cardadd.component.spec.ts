import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardaddComponent } from './cardadd.component';

describe('CardaddComponent', () => {
  let component: CardaddComponent;
  let fixture: ComponentFixture<CardaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
