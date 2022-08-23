import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(private usersService: UsersService, 
              private router: Router){}
  
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("Guarding Auth canLoad")
    return this.canAnything(route.path || '/');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      console.log("Guarding Auth canActivate");
      return this.canAnything(state.url);
  }

  canAnything(url: string): Observable<boolean> | boolean {
    return this.usersService.isLoggedInAsync().pipe(
      tap(ok => {
        if (!ok) {
          this.usersService.redirectAfterLogin = url;
          this.router.navigateByUrl("/login");
        }
      })
    );
  }
  
}
