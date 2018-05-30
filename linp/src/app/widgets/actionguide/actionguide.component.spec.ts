import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionguideComponent} from './actionguide.component';

describe('ActionguidemodalComponent', () => {
  let component: ActionguideComponent;
  let fixture: ComponentFixture<ActionguideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionguideComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
