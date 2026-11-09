import { computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export abstract class BaseLookupState<T> {
    protected readonly notify = inject(NotificationService, { optional: true });

    // Bandera para permitir carga lazy (bajo demanda)
    private readonly _requested = signal<boolean>(false);

    /**
     * Contrato obligatorio (DIP):
     * El hijo indica cómo obtener los datos mediante su servicio de API.
     */
    protected abstract fetchRequest(): Observable<T[]>;

    /**
     * Nombre descriptivo para logs o notificaciones.
     */
    protected getEntityName(): string {
        return 'catálogo';
    }

    /**
     * Manejador de error personalizable por el hijo.
     */
    protected handleError(error: unknown): void {
        this.notify?.error(`No se pudo cargar ${this.getEntityName()}`);
    }

    // Motor reactivo estándar de Angular
    protected readonly resource = rxResource({
        // Si no se ha solicitado la carga, devolvemos undefined para dejar el recurso en estado 'idle'
        params: () => (this._requested() ? true : undefined),
        defaultValue: [] as T[],
        stream: () => {
            return this.fetchRequest().pipe(
                retry(2),
                catchError((error) => {
                    this.handleError(error);
                    // Emitimos array vacío para evitar que Angular lance el error NG0991
                    return of([] as T[]);
                })
            );
        }
    });

    // ==========================================
    // API PÚBLICA (Signals y Métodos de Caché)
    // ==========================================
    public readonly data = this.resource.value;
    public readonly isLoading = this.resource.isLoading;
    public readonly hasData = computed(() => this.data().length > 0);

    /**
     * Carga los datos sólo si no existen en memoria y no se están cargando.
     * Ideal para asociar al evento de apertura de un dropdown / select.
     */
    public loadLookupCache(): void {
        if (this.hasData() || this.isLoading()) return;
        this._requested.set(true);
    }

    /**
     * Invalida la caché y fuerza una nueva petición HTTP.
     */
    public reload(): void {
        this._requested.set(true);
        this.resource.reload();
    }

    /**
     * Resetea el catálogo a vacío y regresa al estado idle.
     */
    public clearCache(): void {
        this._requested.set(false);
        this.resource.set([]);
    }
}