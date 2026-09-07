import { computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { CrudState } from '../interfaces/crud-state.interface';
import { NotificationService } from '../services/notification.service';

export abstract class BaseCrudStateV2<T extends { id: number | string }, F = any, TWrite = Partial<T>> implements CrudState<T, F, TWrite> {
    protected readonly notify = inject(NotificationService);

    // 1. Separamos el estado de paginación/filtros en señales independientes.
    // Esto es clave porque rxResource "escuchará" estas señales.
    protected _page = signal<number>(1);
    protected _limit = signal<number>(10);
    protected _filters = signal<F | null>(this.getInitialFilters());

    // Opcional: Señal para controlar el loading durante las mutaciones (crear, editar, etc.)
    protected _isMutating = signal<boolean>(false);

    // ==========================================
    // CONTRATOS (Los hijos DEBEN implementar esto)
    // ==========================================
    protected abstract getEntityName(): string;
    protected abstract fetchRequest(page: number, limit: number, filters: F): Observable<{ data: T[], total: number }>;
    protected abstract createRequest(data: TWrite): Observable<any>;
    protected abstract updateRequest(id: number | string, data: TWrite): Observable<any>;
    protected abstract changeStatusRequest(id: number | string, status: boolean, motivo?: string): Observable<any>;
    protected abstract deleteRequest(id: number | string): Observable<any>;

    protected onAfterMutate(): void { }

    protected getInitialFilters(): F | null {
        return null;
    }

    // ==========================================
    // LÓGICA REACTIVA CENTRALIZADA (Con rxResource)
    // ==========================================
    protected resource = rxResource({
        // params es reactivo: cada vez que _page, _limit o _filters cambien, 
        // el stream se ejecutará de nuevo automáticamente.
        params: () => ({
            page: this._page(),
            limit: this._limit(),
            filters: this._filters() as F
        }),
        stream: ({ params }) => {
            return this.fetchRequest(params.page, params.limit, params.filters).pipe(
                catchError((error: Error) => {
                    const errorMsg = error?.message || 'Error inesperado';
                    this.notify.error(`Error al cargar ${this.getEntityName()}: ${errorMsg}`);
                    
                    // 🔥 CORRECCIÓN CRÍTICA: En lugar de devolver EMPTY, relanzamos el error.
                    // Esto permite que el resource actualice su señal interna .error() y evitamos el error NG0991.
                    return throwError(() => new Error(errorMsg));
                })
            );
        }
    });

    // ==========================================
    // SEÑALES EXPUESTAS A LA VISTA
    // ==========================================
    // Extraemos los datos del valor resuelto del recurso
    public data = computed(() => this.resource.value()?.data ?? []);
    public total = computed(() => this.resource.value()?.total ?? 0);
    
    // El loading global es true si el recurso está cargando o si estamos mutando algo
    public isLoading = computed(() => this.resource.isLoading() || this._isMutating());
    
    public page = this._page.asReadonly();
    public limit = this._limit.asReadonly();

    // ==========================================
    // MÉTODOS DE LECTURA (Desencadenan recargas automáticas)
    // ==========================================
    public loadData(): void { 
        this.resource.reload(); 
    }

    public changePage(newPage: number): void {
        this._page.set(newPage); // rxResource detecta este cambio y hace fetch
    }

    public changeLimit(newLimit: number): void {
        this._limit.set(newLimit);
        this._page.set(1); // Reset a la página 1. (RxResource agrupa ambos cambios y hace un solo fetch)
    }

    public setFilters(filters: F): void {
        this._filters.set(filters);
        this._page.set(1);
    }

    // ==========================================
    // OPERACIONES CRUD ESTANDARIZADAS
    // ==========================================
    public async createNew(data: TWrite): Promise<void> {
        this._isMutating.set(true);
        try {
            await firstValueFrom(this.createRequest(data));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this.notify.error(`Error al crear ${this.getEntityName()}.`);
            throw error;
        } finally {
            this._isMutating.set(false);
        }
    }

    public async edit(id: number | string, data: TWrite): Promise<void> {
        this._isMutating.set(true);
        try {
            await firstValueFrom(this.updateRequest(id, data));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this.notify.error(`Error al editar ${this.getEntityName()}`);
            throw error;
        } finally {
            this._isMutating.set(false);
        }
    }

    public async changeState(id: number | string, newState: string, motivo_cambio?: string): Promise<void> {
        this._isMutating.set(true);
        try {
            await firstValueFrom(this.changeStatusRequest(id, newState === 'Activo', motivo_cambio));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this.notify.error(`Error al cambiar estado de ${this.getEntityName()}`);
            throw error;
        } finally {
            this._isMutating.set(false);
        }
    }

    public async delete(id: number | string): Promise<void> {
        this._isMutating.set(true);
        try {
            await firstValueFrom(this.deleteRequest(id));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this.notify.error(`Error al eliminar ${this.getEntityName()}`);
            throw error;
        } finally {
            this._isMutating.set(false);
        }
    }
}