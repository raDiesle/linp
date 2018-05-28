import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PreparegameComponent} from './preparegame.component';

describe('PreparegameComponent', () => {
  let component: PreparegameComponent;
  let fixture: ComponentFixture<PreparegameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreparegameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
