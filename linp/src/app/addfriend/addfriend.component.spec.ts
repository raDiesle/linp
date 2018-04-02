import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfriendComponent } from './addfriend.component';

describe('AddfriendComponent', () => {
  let component: AddfriendComponent;
  let fixture: ComponentFixture<AddfriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
