import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionguidemodalComponent} from './actionguidemodal.component';

describe('ActionguidemodalComponent', () => {
  let component: ActionguidemodalComponent;
  let fixture: ComponentFixture<ActionguidemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionguidemodalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionguidemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
