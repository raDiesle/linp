import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-wordsdrumroll',
  templateUrl: './wordsdrumroll.component.html',
  styleUrls: ['./wordsdrumroll.component.css']
})
export class WordsdrumrollComponent implements OnInit {

  yourRoleWordAnimation: string;

  // @Input final word
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    const yourWordAnimation = ["your", "word", "to", "explain", "is", "_"];
//TODO      var yourRoleAnimation = ["YOU", "ARE", "THE", "? QUESTIONMARK ?"];
    const theLastWord = "'House'";
    yourWordAnimation.push(theLastWord);
    let source = Observable
      .interval(500)
      .timeInterval()
      .take(yourWordAnimation.length);
    source.subscribe((listItem) => {
      this.yourRoleWordAnimation = yourWordAnimation[listItem.value];
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
  }

}
