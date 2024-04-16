import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  VERSION as MAT_VERSION,
  MatNativeDateModule,
} from '@angular/material/core';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    DragDropModule,
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule),
    provideStore(),
  ],
};
