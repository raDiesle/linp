import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GamerulesComponent} from './gamerules.component';

describe('GamerulesComponent', () => {
  let component: GamerulesComponent;
  let fixture: ComponentFixture<GamerulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GamerulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamerulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
