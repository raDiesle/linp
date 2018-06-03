# linp
linq clone app

# Helpful documentations of used frameworks

* https://github.com/DavidOndrus/xliff-translator-tool
* https://material.io/icons/
* http://valor-software.com/ngx-bootstrap/#/
* https://v4-alpha.getbootstrap.com/
* https://angular.io/
* https://cli.angular.io/
* http://codingthesmartway.com/using-bootstrap-with-angular/
* https://guides.github.com/features/mastering-markdown/
* https://angularfirebase.com/lessons/hammerjs-angular-5-animations-for-mobile-gestures-tutorial/ https://github.com/angular/angularfire2/blob/master/docs/1-install-and-setup.md
* https://coryrylan.com/blog/deploy-angular-cli-apps-to-firebase
* 9fwPJ3l8KYIv
* https://github.com/twbs/bootstrap/releases
* Loading Indicator: https://codepen.io/zessx/pen/RNPKKK


Material
* Gamerules of french https://boardgamegeek.com/thread/557251/scoring-newest-version 
* http://www.spielkult.de/linq.htm
* https://www.hall9000.de/rubriken/spiele/kurzspielregeln/linq.pdf
* https://en.wikipedia.org/wiki/List_of_Disney_animated_universe_characters

1. Install git, tortoisegit
   1. https://git-for-windows.github.io/
   1. https://tortoisegit.org/download/

1. Checkout Linp
	1. Register Github account
	1. Right click in folder: tortoisegit - Git Clone (checkout) - https://github.com/raDiesle/linp.git
	
1. Install nodejs with npm
https://nodejs.org/en/

1. install angular-cli
	1. Open CMD in folder in Windows: STRG+SHIFT right mouse - open CMD here
	1. npm install -g @angular/cli

1. Run webserver
	1. ng serve
	1. open http://localhost:4200



* Auth examples
{
"rules": {
"users": {
"$uid": {
".write": "$uid === auth.uid",
".read": true
}
}
}
}

* Validate
{
"rules": {
"foo": {
".validate": "newData.isString()"
}
}
}

Remember
* https://github.com/DevExpress/testcafe/issues/912