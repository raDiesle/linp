import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NextbuttonComponent} from './nextbutton.component';

describe('NextbuttonComponent', () => {
  let component: NextbuttonComponent;
  let fixture: ComponentFixture<NextbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NextbuttonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
