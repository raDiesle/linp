import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-wordsdrumroll',
  templateUrl: './wordsdrumroll.component.html',
  styleUrls: ['./wordsdrumroll.component.css']
})
export class WordsdrumrollComponent implements OnInit {

  yourRoleWordAnimation: string;

  // @Input final word
  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  _word: string;

  get word() {
    return this._word;
  }

  @Input()
  set word(word: string) {
    this._word = word;

    if (!word) {
      return;
    }

    // Better implementation: https://gist.github.com/JamieMason/303c5fc90b28c28a804e3f7ea9ab01f1
    // registered multiple times is bad
    Observable.of(this.word);
    const yourWordAnimation = ['.', '..', '...', '....', '.....', this.word];
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

  ngOnInit() {
  }

}
