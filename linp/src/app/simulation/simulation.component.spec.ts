import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {SimulationComponent} from './simulation.component';
import {ActivatedRouteStub} from "../stubs/ActivatedRouteStub";
import {ActivatedRoute} from "@angular/router";
import {FirebaseApp} from "angularfire2";
import {AngularFirestore} from "angularfire2/firestore";

describe('SimulationComponent', () => {
  let component: SimulationComponent;
  let fixture: ComponentFixture<SimulationComponent>;
  let activatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SimulationComponent],
      providers: [
        AngularFirestore,
        FirebaseApp,
        {provide: ActivatedRoute, useValue: activatedRoute}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
    // activatedRoute.testParamMap = { id: expectedHero.id };

    fixture = TestBed.createComponent(SimulationComponent);
    component = fixture.componentInstance;
    //component.gameName = 'test';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create mocks for firstguess', () => {
    /*
    component.createForFirstGuessGame();
    */
  })
});
