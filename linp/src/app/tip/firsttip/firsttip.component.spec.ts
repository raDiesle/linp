import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FirsttipComponent} from './firsttip.component';

describe('FirsttipComponent', () => {
  let component: FirsttipComponent;
  let fixture: ComponentFixture<FirsttipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirsttipComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirsttipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
