import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateRouteGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: any,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const year = +next.paramMap.get('year');
    const month = +next.paramMap.get('month');
    const day = +next.paramMap.get('day');

    // Check if the parameters are valid dates or numbers
    if (this.isValidDate(year, month, day)) {
      return true; // Proceed if the date is valid
    } else {
      // Redirect to the URL with today's date or a specific date
      const today = new Date();
      const redirectUrl = `/${today.getFullYear()}/${
        today.getMonth() + 1
      }/${today.getDate()}`;
      this.router.navigate([redirectUrl]);
      return false;
    }
  }

  private isValidDate(year: number, month: number, day: number): boolean {
    // JavaScript counts months from 0 to 11
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }
}
