import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { ENV_TOKEN } from './core/tokens/environment.token';

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
    //NOTA: Para el datepicker se recomienda rotundamente importarlo en los modulos que se nececiten para optimizar al maximo la carga inicial
    // provideNativeDateAdapter(),
    // { provide: LOCALE_ID, useValue: 'es-PE' },
    // { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    // hasta aqui se importaria en algun modulo que use datepicker
    // { provide: MatDatepickerIntl, useClass: CustomDatepickerIntl },
    // { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
  ]
};
