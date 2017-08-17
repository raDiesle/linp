import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-wordsdrumroll',
  templateUrl: './wordsdrumroll.component.html',
  styleUrls: ['./wordsdrumroll.component.css']
})
export class WordsdrumrollComponent implements OnInit {

  _word: string;
  yourRoleWordAnimation: string;

  // @Input final word
  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
  }

  @Input()
  set word(word: string) {
    this._word = word;

    if (!word) {
      return;
    }
    // registered multiple times is bad
    Observable.of(this.word)
    const yourWordAnimation = ['your', 'word', 'to', 'explain', 'is', '.......', this.word];
    const yourRoleAnimationForQuestionmark = ['YOU', 'ARE', 'THE', '? QUESTIONMARK ?'];
    const wordSequence = (this.word === '?') ? yourRoleAnimationForQuestionmark : yourWordAnimation;

    const source = Observable
      .interval(500)
      .timeInterval()
      .take(yourWordAnimation.length);
    source.subscribe((singleWord) => {
      this.yourRoleWordAnimation = wordSequence[singleWord.value];
      this.changeDetectorRef.markForCheck();
    });
  }

  get word() {
    return this._word;
  }

}
