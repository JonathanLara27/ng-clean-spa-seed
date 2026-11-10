import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject, injectAsync } from '@angular/core';
import { throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
// import { UserState } from '../../features/auth/application/state/user.state';
import { SKIP_NOTIF } from '../tokens/skip-notification.token';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    // const userState = inject(UserState);
    
    const getNotifyService = injectAsync(() => 
        import('../services/notification.service').then(m => m.NotificationService)
    );

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (req.context.get(SKIP_NOTIF) === true) {
                return throwError(() => error);
            }

            // 🚀 2. Ejecutamos la promesa de injectAsync() y la convertimos en Observable
            return from(getNotifyService()).pipe(
                switchMap((notify) => {
                    const backendMessage = error.error?.detail || error.error?.message || error.error?.mensaje || error.message;

                    switch (error.status) {
                        case HttpStatusCode.Unauthorized:
                            notify.warning('Tu sesión ha expirado. Por favor, ingresa nuevamente.');
                            // userState.logout();
                            break;

                        case HttpStatusCode.Forbidden:
                            notify.error(backendMessage || 'No tienes los permisos necesarios para realizar esta acción.');
                            break;

                        case HttpStatusCode.NotFound:
                            notify.error(`${backendMessage ? backendMessage : 'El recurso solicitado no existe'}`);
                            break;

                        case HttpStatusCode.InternalServerError:
                            notify.error('Error interno del servidor. Nuestro equipo ya fue notificado.');
                            break;

                        case HttpStatusCode.BadRequest:
                            notify.error(backendMessage || 'Solicitud incorrecta. Verifica los datos enviados.');
                            break;

                        case HttpStatusCode.ServiceUnavailable:
                            notify.error(backendMessage || 'El servicio no está disponible temporalmente.');
                            break;

                        default:
                            const finalMessage = error.status === 0
                                ? 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                                : (backendMessage || 'Ocurrió un error inesperado al procesar tu solicitud.');
                            notify.error(finalMessage);
                            break;
                    }

                    // 🚀 3. Propagamos el error para que los componentes puedan apagar sus loadings
                    return throwError(() => error);
                })
            );
        })
    );
};