import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WaitingdotsComponent} from './waitingdots.component';

describe('WaitingdotsComponent', () => {
  let component: WaitingdotsComponent;
  let fixture: ComponentFixture<WaitingdotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingdotsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingdotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
