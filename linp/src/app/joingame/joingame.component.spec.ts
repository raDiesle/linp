import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JoinGameComponent} from './joingame.component';

describe('JoinGameComponent', () => {
  let component: JoinGameComponent;
  let fixture: ComponentFixture<JoinGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JoinGameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
