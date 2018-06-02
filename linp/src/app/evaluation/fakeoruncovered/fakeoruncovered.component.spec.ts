import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeoruncoveredComponent } from './fakeoruncovered.component';

describe('FakeoruncoveredComponent', () => {
  let component: FakeoruncoveredComponent;
  let fixture: ComponentFixture<FakeoruncoveredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FakeoruncoveredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeoruncoveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
