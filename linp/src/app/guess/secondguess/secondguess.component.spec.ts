import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondguessComponent } from './secondguess.component';

describe('SecondguessComponent', () => {
  let component: SecondguessComponent;
  let fixture: ComponentFixture<SecondguessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondguessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondguessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
