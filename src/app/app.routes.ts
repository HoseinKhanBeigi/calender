import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { TimeSlotComponent } from './components/time-slot/time-slot.component';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';
import { DateRedirectGuard } from './date-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./calendar/calendar-view/calendar-view.component').then(
        (c) => c.CalendarViewComponent
      ),
    canActivate: [DateRedirectGuard], // Apply the guard to the root path
  },

  {
    path: ':year/:month/:day',
    loadComponent: () =>
      import('./calendar/calendar-view/calendar-view.component').then(
        (c) => c.CalendarViewComponent
      ),
  },
];
