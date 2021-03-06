import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import User from '../models/user.model';
import { StoreUserService } from '../services/store-user.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserGuard implements CanActivate {
  public user: User;
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    let canActivate = this.store.select('usersApp').pipe(
      map((userResponse) => {
        let user = userResponse.user;

        if (user !== undefined) {
          return true;
        }

        console.log('Access denied');
        this.router.navigate(['/home']);
        return false;
      })
    );
    return canActivate;
  }
}
