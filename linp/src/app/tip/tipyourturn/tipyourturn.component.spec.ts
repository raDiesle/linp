import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipyourturnComponent } from './tipyourturn.component';

describe('TipyourturnComponent', () => {
  let component: TipyourturnComponent;
  let fixture: ComponentFixture<TipyourturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipyourturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipyourturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
