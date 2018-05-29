import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FirsttiprulesComponent} from './firsttiprules.component';

describe('FirsttiprulesComponent', () => {
  let component: FirsttiprulesComponent;
  let fixture: ComponentFixture<FirsttiprulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirsttiprulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirsttiprulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
