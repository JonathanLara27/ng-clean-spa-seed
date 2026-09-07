import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import { ENV_TOKEN } from './core/tokens/environment.token';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './core/providers/custom-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ENV_TOKEN, useValue: environment },
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      APP_ROUTES,
      withComponentInputBinding(),
      withHashLocation(),
    ),
    provideHttpClient(
      withInterceptors([
        loaderInterceptor,
        apiInterceptor,
        errorInterceptor
      ])
    ),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
  ]
};
