import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginbyemailComponent } from './loginbyemail.component';

describe('LoginbyemailComponent', () => {
  let component: LoginbyemailComponent;
  let fixture: ComponentFixture<LoginbyemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginbyemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginbyemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
