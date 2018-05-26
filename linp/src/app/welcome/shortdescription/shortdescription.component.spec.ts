import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShortdescriptionComponent} from './shortdescription.component';

describe('ShortdescriptionComponent', () => {
  let component: ShortdescriptionComponent;
  let fixture: ComponentFixture<ShortdescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShortdescriptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortdescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
