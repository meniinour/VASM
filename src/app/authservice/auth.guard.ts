import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      take(1), // Prend seulement la valeur actuelle
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }
        
        // Redirection vers /login avec conservation de l'URL demandée
        return this.router.createUrlTree(
          ['/login'], 
          { 
            queryParams: { 
              returnUrl: this.router.url 
            } 
          }
        );
      })
    );
  }
}