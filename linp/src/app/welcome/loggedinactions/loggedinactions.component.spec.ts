import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoggedinactionsComponent} from './loggedinactions.component';

describe('LoggedinactionsComponent', () => {
  let component: LoggedinactionsComponent;
  let fixture: ComponentFixture<LoggedinactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedinactionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedinactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
