import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstguessrulesComponent } from './firstguessrules.component';

describe('FirstguessrulesComponent', () => {
  let component: FirstguessrulesComponent;
  let fixture: ComponentFixture<FirstguessrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstguessrulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstguessrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
