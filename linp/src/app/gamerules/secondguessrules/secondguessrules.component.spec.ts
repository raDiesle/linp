import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SecondguessrulesComponent} from './secondguessrules.component';

describe('SecondguessrulesComponent', () => {
  let component: SecondguessrulesComponent;
  let fixture: ComponentFixture<SecondguessrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecondguessrulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondguessrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
