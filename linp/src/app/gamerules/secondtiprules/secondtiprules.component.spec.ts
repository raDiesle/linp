import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondtiprulesComponent } from './secondtiprules.component';

describe('SecondtiprulesComponent', () => {
  let component: SecondtiprulesComponent;
  let fixture: ComponentFixture<SecondtiprulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondtiprulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondtiprulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
