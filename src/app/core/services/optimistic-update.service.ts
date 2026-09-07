import { Service, inject } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { NotificationService } from './notification.service'; // Ajusta tu ruta

const DEFAULT_DURATION_OPTIMISTIC = 5000; // Tiempo por defecto para esperar antes de llamar a la API
const DEFAULT_ACTION_TEXT = 'DESHACER'; // Texto por defecto para el botón de acción
const DEFAULT_ERROR_MESSAGE = 'No se pudo completar la acción. Se han revertido los cambios.'; // Mensaje por defecto para errores

export interface OptimisticConfig<T> {
    /** La función que cambia el Signal/Variable al instante (Ej: estado = 'Inactivo') */
    optimisticAction: () => void;
    /** La función que revierte el cambio si el usuario deshace o la API falla */
    revertAction: () => void;
    /** La petición HTTP real que se ejecutará si no se cancela */
    apiCall: Observable<T>;
    /** El mensaje a mostrar en el Snackbar */
    successMessage: string;
    /** Tiempo de espera antes de enviar a la API (Por defecto 5000ms) */
    duration?: number;
    errorMessage?: string;
}

@Service()
export class OptimisticUpdateService {
    private notify = inject(NotificationService);

    public execute<T>(config: OptimisticConfig<T>): void {
        const waitTime = config.duration ?? DEFAULT_DURATION_OPTIMISTIC;

        // 1. Ejecutar cambio visual inmediatamente (0 latencia)
        config.optimisticAction();

        // 2. Mostrar notificación con el botón "DESHACER"
        // Le pasamos el waitTime exacto para que la barra desaparezca justo cuando se lanza la API
        const snackRef = this.notify.success(config.successMessage, DEFAULT_ACTION_TEXT, waitTime);

        // 3. Subject para abortar la misión
        const cancel$ = new Subject<void>();

        // Si el usuario hace clic en "DESHACER"
        snackRef.onAction().subscribe(() => {
            config.revertAction(); // Revertimos visualmente
            cancel$.next();        // Disparamos el botón de abortar
            cancel$.complete();
        });

        // 4. El motor de tiempo de fondo
        timer(waitTime).pipe(
            // Si cancel$ emite, este flujo muere pacíficamente y NUNCA llama al switchMap
            takeUntil(cancel$),

            // Si pasaron los X segundos en paz, disparamos la petición
            switchMap(() => config.apiCall),

            // Si el backend falla (Error 500, sin internet, etc.)
            catchError((err) => {
                config.revertAction(); // Revertimos visualmente porque fue una mentira optimista
                // Nota: El Global Error Interceptor se encargará de mostrar el mensaje rojo, 
                // nosotros solo devolvemos EMPTY para que el flujo termine sin romper la app.
                // Recordar usar el SKIP_NOTIF en la petición para evitar el doble mensaje de error.
                const msg = config.errorMessage ?? DEFAULT_ERROR_MESSAGE;
                this.notify.error(msg);
                return EMPTY;
            })
        ).subscribe({
            next: () => {
                // console.log('✅ [Optimistic UI] Cambios consolidados en BD.');
                cancel$.complete();
            }
        });
    }
}