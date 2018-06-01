import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolekeyComponent } from './rolekey.component';

describe('RolekeyComponent', () => {
  let component: RolekeyComponent;
  let fixture: ComponentFixture<RolekeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolekeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolekeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
