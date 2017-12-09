import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(public afAuth: AngularFireAuth,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {
    return this.afAuth.authState
      .map(authState => authState && !!authState.uid)
      .take(1)
      .do(allowed => {
        if (!allowed) {
          this.router.navigate(['/']);
        }
      });
  }
}
