import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { BrowserModule } from '@angular/platform-browser';
import {
  MAT_DATE_LOCALE,
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
    provideStore()
],
};
