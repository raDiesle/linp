import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivegamesComponent } from './activegames.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireAuth} from 'angularfire2/auth';


const ngbActiveModalStub = {};
const afAuthStub = {};

describe('ActivegamesComponent', () => {
  let component: ActivegamesComponent;
  let fixture: ComponentFixture<ActivegamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivegamesComponent],
      providers: [{provide: NgbActiveModal, useValue: ngbActiveModalStub},
        {provide: AngularFireAuth, useValue: afAuthStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivegamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should read and write to localstorage', () => {
  });
});
