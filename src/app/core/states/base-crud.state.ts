import { computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, firstValueFrom, Observable, Subject, switchMap, tap } from 'rxjs';
import { CrudState } from '../interfaces/crud-state.interface';
import { PaginatedState, INIT_PAGINATED_STATE } from '../interfaces/pagination.interface';
import { NotificationService } from '../services/notification.service';

export abstract class BaseCrudState<T extends { id: number | string }, F = any, TWrite = Partial<T>> implements CrudState<T, F, TWrite> {
    protected readonly notify = inject(NotificationService);
    protected readonly destroyRef = inject(DestroyRef);
    protected readonly reload$ = new Subject<void>();

    protected _state = signal<PaginatedState<T, F>>({
        ...INIT_PAGINATED_STATE(),
        filters: this.getInitialFilters()
    });

    // Señales computadas expuestas
    public data = computed(() => this._state().data);
    public total = computed(() => this._state().total);
    public page = computed(() => this._state().page);
    public limit = computed(() => this._state().limit);
    public isLoading = computed(() => this._state().isLoading);

    constructor() {
        this.setupDataStream();
    }

    // ==========================================
    // CONTRATOS (Los hijos DEBEN implementar esto)
    // ==========================================
    protected abstract getEntityName(): string;
    protected abstract fetchRequest(page: number, limit: number, filters: F): Observable<{ data: T[], total: number }>;
    protected abstract createRequest(data: TWrite): Observable<any>;
    protected abstract updateRequest(id: number | string, data: TWrite): Observable<any>;
    protected abstract changeStatusRequest(id: number | string, status: boolean, motivo?: string): Observable<any>;
    protected abstract deleteRequest(id: number | string): Observable<any>;

    // Hook opcional (Para limpiar cachés en los hijos)
    protected onAfterMutate(): void { }

    protected getInitialFilters(): F | null {
        return null; // Por defecto no hay filtros
    }

    // ==========================================
    // LÓGICA REACTIVA CENTRALIZADA
    // ==========================================
    private setupDataStream(): void {
        this.reload$.pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(() => this._state.update(s => ({ ...s, isLoading: true, error: null }))),
            switchMap(() => {
                const { page, limit, filters } = this._state();
                return this.fetchRequest(page, limit, filters as F).pipe(
                    catchError((error: Error) => {
                        const errorMsg = error?.message || 'Error inesperado';
                        this.notify.error(`Error al cargar ${this.getEntityName()}: ${errorMsg}`);
                        this._state.update(s => ({ ...s, error: errorMsg, data: [], total: 0, isLoading: false }));
                        return EMPTY;
                    })
                );
            })
        ).subscribe({
            next: (res) => this._state.update(s => ({ ...s, data: res.data, total: res.total, isLoading: false })),
            error: () => this._state.update(s => ({ ...s, isLoading: false }))
        });
    }

    public loadData(): void { this.reload$.next(); }

    public changePage(newPage: number): void {
        this._state.update(s => ({ ...s, page: newPage }));
        this.loadData();
    }

    public changeLimit(newLimit: number): void {
        this._state.update(s => ({ ...s, limit: newLimit, page: 1 }));
        this.loadData();
    }

    public setFilters(filters: F): void {
        this._state.update(s => ({ ...s, filters, page: 1 }));
        this.loadData();
    }

    // ==========================================
    // OPERACIONES CRUD ESTANDARIZADAS
    // ==========================================
    public async createNew(data: TWrite): Promise<void> {
        this._state.update(s => ({ ...s, isLoading: true, error: null }));
        try {
            await firstValueFrom(this.createRequest(data));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this._state.update(s => ({ ...s, isLoading: false, error: error.message }));
            this.notify.error(`Error al crear ${this.getEntityName()}.`);
            throw error;
        }
    }

    public async edit(id: number | string, data: TWrite): Promise<void> {
        this._state.update(s => ({ ...s, isLoading: true, error: null }));
        try {
            await firstValueFrom(this.updateRequest(id, data));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this._state.update(s => ({ ...s, isLoading: false, error: error.message }));
            this.notify.error(`Error al editar ${this.getEntityName()}`);
            throw error;
        }
    }

    public async changeState(id: number | string, newState: string, motivo_cambio?: string): Promise<void> {
        this._state.update(s => ({ ...s, isLoading: true, error: null }));
        try {
            await firstValueFrom(this.changeStatusRequest(id, newState === 'Activo', motivo_cambio));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this._state.update(s => ({ ...s, isLoading: false, error: error.message }));
            this.notify.error(`Error al cambiar estado de ${this.getEntityName()}`);
            throw error;
        }
    }

    public async delete(id: number | string): Promise<void> {
        this._state.update(s => ({ ...s, isLoading: true, error: null }));
        try {
            await firstValueFrom(this.deleteRequest(id));
            this.loadData();
            this.onAfterMutate();
        } catch (error: any) {
            this._state.update(s => ({ ...s, isLoading: false, error: error.message }));
            this.notify.error(`Error al eliminar ${this.getEntityName()}`);
            throw error;
        }
    }
}