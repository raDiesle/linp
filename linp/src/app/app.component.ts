import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, UrlSegment} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gamename: string;
  title = 'app';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) {


  }

  ngOnInit() {
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        let fullUrl = s.urlAfterRedirects;
        if (fullUrl.split("/").length >= 3) {
          this.gamename = fullUrl.split("/")[2];
          this.changeDetectorRef.markForCheck();
        }
      }
    });
  }
}
