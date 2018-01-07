import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginbyemailComponent } from './loginbyemail.component';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AngularFireAuth} from "angularfire2/auth";


const ngbActiveModalStub = {};
const afAuthStub = {};

describe('LoginbyemailComponent', () => {
  let component: LoginbyemailComponent;
  let fixture: ComponentFixture<LoginbyemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginbyemailComponent],
      providers: [{provide: NgbActiveModal, useValue: ngbActiveModalStub},
        {provide: AngularFireAuth, useValue: afAuthStub}]
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

  it('should read and write to localstorage', () => {
    component.localStorageEmail = "playera@test.de";
    expect(component.userProfileEmail).toBe('playera@test.de');
  });
});
