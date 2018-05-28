import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EvaluationrulesComponent} from './evaluationrules.component';

describe('EvaluationrulesComponent', () => {
  let component: EvaluationrulesComponent;
  let fixture: ComponentFixture<EvaluationrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationrulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
