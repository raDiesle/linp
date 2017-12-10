import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FinalizeroundComponent} from './finalizeround.component';

describe('FinalizeroundComponent', () => {
  let component: FinalizeroundComponent;
  let fixture: ComponentFixture<FinalizeroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinalizeroundComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizeroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
