import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatewordComponent} from './createword.component';

describe('CreatewordComponent', () => {
  let component: CreatewordComponent;
  let fixture: ComponentFixture<CreatewordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatewordComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatewordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
