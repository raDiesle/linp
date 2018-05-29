import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IngameprogressrulesComponent} from './ingameprogressrules.component';

describe('IngameprogressrulesComponent', () => {
  let component: IngameprogressrulesComponent;
  let fixture: ComponentFixture<IngameprogressrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IngameprogressrulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngameprogressrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
