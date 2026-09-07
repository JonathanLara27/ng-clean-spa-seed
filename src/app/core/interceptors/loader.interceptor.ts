import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderState } from '../states/loader.state';
import { SKIP_LOADER } from '../tokens/skip-loader.token';

// Contador global para este interceptor
let activeRequests = 0;

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loaderState = inject(LoaderState);

  // 1. Vía de escape: Verificamos el contexto interno de Angular
  if (req.context.get(SKIP_LOADER) === true) {
    return next(req); // Pasa directo, sin tocar el contador ni clonar headers
  }

  // 2. Lógica del contador
  if (activeRequests === 0) {
    loaderState.setLoading(true); // Solo muestra el loader si no hay otras peticiones activas
  }

  activeRequests++;

  return next(req).pipe(
    finalize(() => {
      activeRequests--;

      // Solo se oculta cuando TODAS las peticiones han terminado
      if (activeRequests === 0) {
        loaderState.setLoading(false);
      }
    })
  );
};