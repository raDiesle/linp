import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamelobbyrulesComponent } from './gamelobbyrules.component';

describe('GamelobbyrulesComponent', () => {
  let component: GamelobbyrulesComponent;
  let fixture: ComponentFixture<GamelobbyrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamelobbyrulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamelobbyrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
