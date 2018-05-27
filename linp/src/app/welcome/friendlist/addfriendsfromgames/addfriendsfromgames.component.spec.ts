import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfriendsfromgamesComponent } from './addfriendsfromgames.component';

describe('AddfriendsfromgamesComponent', () => {
  let component: AddfriendsfromgamesComponent;
  let fixture: ComponentFixture<AddfriendsfromgamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfriendsfromgamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfriendsfromgamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
