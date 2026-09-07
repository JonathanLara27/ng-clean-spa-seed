import { HttpInterceptorFn, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service'; // Ajusta ruta
import { SKIP_NOTIF } from '../tokens/skip-notification.token';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    // const authState = inject(AuthStateService);
    const notify = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Si la petición traía el token para saltar notificaciones (ej. Autocompletes)
            if (req.context.get(SKIP_NOTIF) === true) {
                return throwError(() => error);
            }

            const backendMessage = error.error?.message || error.error?.mensaje || error.message;

            switch (error.status) {
                case HttpStatusCode.Unauthorized:
                    console.warn('[Error Interceptor] Sesión no autorizada o expirada.');
                    notify.warning('Tu sesión ha expirado. Por favor, ingresa nuevamente.');
                    // authState.clearSession();
                    router.navigate(['/auth']);
                    break;

                case HttpStatusCode.Forbidden:
                    notify.error(backendMessage || 'No tienes los permisos necesarios para realizar esta acción.');
                    break;

                case HttpStatusCode.NotFound:
                    notify.error('El recurso solicitado no existe o no fue encontrado.');
                    break;

                case HttpStatusCode.InternalServerError:
                    notify.error('Error interno del servidor. Nuestro equipo ya fue notificado.');
                    break;

                case HttpStatusCode.BadRequest:
                    notify.error(backendMessage || 'Solicitud incorrecta. Verifica los datos enviados.');
                    break;

                default:
                    // Si el error es 0, suele ser que el backend está apagado o no hay internet
                    const finalMessage = error.status === 0
                        ? 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                        : (backendMessage || 'Ocurrió un error inesperado al procesar tu solicitud.');
                    notify.error(finalMessage);
                    break;
            }

            // Propagamos el error al componente por si necesita apagar loadings
            return throwError(() => error);
        })
    );
};