import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicrulesComponent} from './basicrules.component';

describe('BasicrulesComponent', () => {
  let component: BasicrulesComponent;
  let fixture: ComponentFixture<BasicrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasicrulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
