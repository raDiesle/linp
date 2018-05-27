import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeoptionsComponent } from './swipeoptions.component';

describe('SwipeoptionsComponent', () => {
  let component: SwipeoptionsComponent;
  let fixture: ComponentFixture<SwipeoptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeoptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeoptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
