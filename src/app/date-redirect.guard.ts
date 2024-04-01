import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DateRedirectGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentDate = new Date();
    this.router.navigate([
      `${currentDate.getFullYear()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}`,
    ]);

    return true; // Allow navigation
  }
}
