import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TimeSlotComponent } from './components/time-slot/time-slot.component';
import { DateRedirectGuard } from './date-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    component: TimeSlotComponent,
    canActivate: [DateRedirectGuard], // Apply the guard to the root path
  },

  {
    path: ':year/:month/:day',
    component: TimeSlotComponent,
  },
];
