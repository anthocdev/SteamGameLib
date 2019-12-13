import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { tap } from "rxjs/operators";

/* Protects routes that require authentication by redirecting user to login page */

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean | UrlTree> | boolean {
    return this.authService.isAuthenticated$.pipe(
      tap(loggedIn => {
        if (!loggedIn) {
          this.authService.login(state.url);
        }
      })
    );
  }
}
