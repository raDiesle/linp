import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {FirebaseGameService} from './firebasegame.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public afAuth: AngularFireAuth,
              private firebaseGameService: FirebaseGameService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.afAuth.authState.subscribe(authUser => {
      this.firebaseGameService.authUserUid = authUser ? authUser.uid : '';
    });

    return this.afAuth.authState
      .map(authState => authState && !!authState.uid)
      .take(1)
      .do(allowed => {
        if (!allowed) {
          this.router.navigate(['/welcome'], {
              queryParams: {
                mode: 'select',
                signInSuccessUrl: state.url
              },
              queryParamsHandling: 'merge'
            }
          );
        }
      });
  }
}
