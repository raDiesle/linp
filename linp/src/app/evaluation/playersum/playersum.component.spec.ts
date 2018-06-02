import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersumComponent } from './playersum.component';

describe('PlayersumComponent', () => {
  let component: PlayersumComponent;
  let fixture: ComponentFixture<PlayersumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
