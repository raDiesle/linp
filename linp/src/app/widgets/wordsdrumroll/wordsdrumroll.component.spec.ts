import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsdrumrollComponent } from './wordsdrumroll.component';

describe('WordsdrumrollComponent', () => {
  let component: WordsdrumrollComponent;
  let fixture: ComponentFixture<WordsdrumrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsdrumrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsdrumrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
