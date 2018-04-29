import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameprogressComponent } from './gameprogress.component';

describe('GameprogressComponent', () => {
  let component: GameprogressComponent;
  let fixture: ComponentFixture<GameprogressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameprogressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
