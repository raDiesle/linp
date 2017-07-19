import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondtipComponent } from './secondtip.component';

describe('SecondtipComponent', () => {
  let component: SecondtipComponent;
  let fixture: ComponentFixture<SecondtipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondtipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondtipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
