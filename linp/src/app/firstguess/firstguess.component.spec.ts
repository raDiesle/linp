import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstguessComponent } from './firstguess.component';

describe('FirstguessComponent', () => {
  let component: FirstguessComponent;
  let fixture: ComponentFixture<FirstguessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstguessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstguessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
