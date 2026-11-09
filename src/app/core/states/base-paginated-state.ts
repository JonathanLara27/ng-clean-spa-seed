import { computed, inject, signal, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { DEFAULT_PAGINATION, PaginatedResult } from '../interfaces/pagination.interface';
import { PaginationFilterDTO } from '../dtos';

/**
 * Clase base abstracta para la gestión del estado de colecciones paginadas.
 * Aplica principios SOLID, Clean Code y la API reactiva nativa de Angular (rxResource).
 *
 * @template T - Tipo de entidad del listado.
 * @template Filters - Tipo de los filtros de búsqueda (opcional).
 */
export abstract class BasePaginatedState<T, Filters = Record<string, unknown>> {
    public readonly notify = inject(NotificationService);

    /**
     * Bandera para control de errores:
     * true: muestra notificación local mediante NotificationService.
     * false: delega el manejo al Interceptor Global HTTP o manejo externo.
     */
    protected useLocalErrorHandler: boolean = true;

    // ==========================================
    // 1. ESTADO DE PARÁMETROS (Signals internas)
    // ==========================================
    protected readonly _page = signal<number>(DEFAULT_PAGINATION.page);
    protected readonly _limit = signal<number>(DEFAULT_PAGINATION.limit);
    protected readonly _filters = signal<Filters | null>(this.getInitialFilters());

    // ==========================================
    // 2. CONTRATOS OBLIGATORIOS (DIP / OCP)
    // ==========================================
    /** Petición asíncrona hacia el servicio de infraestructura */
    protected abstract fetchRequest(paginationFilters: PaginationFilterDTO<Filters>): Observable<PaginatedResult<T>>;

    /** Nombre representativo de la entidad para feedback visual */
    protected abstract getEntityName(): string;

    /** Hook opcional: Filtros iniciales por defecto */
    protected getInitialFilters(): Filters | null {
        return null;
    }

    /**
     * Hook de transformación (OCP): Construye el payload estructurado para la API.
     * Sobrescribible si una entidad requiere formateo específico de parámetros.
     */
    protected buildPayload(page: number, limit: number, filters: Filters | null): PaginationFilterDTO<Filters> {
        return {
            pagination: {
                page,
                per_page: limit
            },
            ...(filters ? { filters } : {})
        };
    }

    /**
     * Manejador centralizado de errores (Template Method).
     */
    protected handleError(error: unknown): void {
        if (!this.useLocalErrorHandler) return;
        const message = error instanceof Error ? error.message : 'Error inesperado';
        this.notify.error(`Error al cargar ${this.getEntityName()}: ${message}`);
    }

    /**
     * Resultado vacío seguro y predecible (LSP: evita null/undefined).
     */
    protected getEmptyResult(): PaginatedResult<T> {
        return {
            data: [],
            total: 0,
            page: this._page(),
            limit: this._limit()
        };
    }

    // ==========================================
    // 3. MOTOR REACTIVO (Single Source of Truth)
    // ==========================================
    protected resource = rxResource({
        defaultValue: this.getEmptyResult(),
        params: () => ({
            page: this._page(),
            limit: this._limit(),
            filters: this._filters()
        }),
        stream: ({ params }) => {
            const payload = this.buildPayload(params.page, params.limit, params.filters);

            return this.fetchRequest(payload).pipe(
                catchError((error: unknown) => {
                    this.handleError(error);
                    // Retorna un resultado seguro para que rxResource no se corrompa ni lance NG0991
                    return of(this.getEmptyResult());
                })
            );
        }
    });

    // ==========================================
    // 4. SEÑALES EXPUESTAS PARA LA VISTA (ISP)
    // ==========================================
    // Derivadas directamente del recurso reactivo: sin señales duplicadas ni llamadas a tap()
    public readonly data: Signal<T[]> = computed(() => this.resource.value().data);
    public readonly total: Signal<number> = computed(() => this.resource.value().total);
    public isLoading: Signal<boolean> = this.resource.isLoading;

    // Parámetros de consulta (solo lectura)
    public readonly page: Signal<number> = this._page.asReadonly();
    public readonly limit: Signal<number> = this._limit.asReadonly();
    public readonly filters: Signal<Filters | null> = this._filters.asReadonly();

    // Helpers computados para las plantillas (evita lógica matemática en HTML)
    // public readonly totalPages = computed(() => Math.ceil(this.total() / (this.limit() || 1)) || 1);
    public readonly isEmpty = computed(() => !this.isLoading() && this.data().length === 0);
    public readonly hasFilters = computed(() => this._filters() !== null);

    // ==========================================
    // 5. ACCIONES PÚBLICAS (Clean Code)
    // ==========================================
    public changePage(page: number): void {
        this._page.set(page);
    }

    public changeLimit(limit: number): void {
        this._limit.set(limit);
        this._page.set(DEFAULT_PAGINATION.page);
    }

    public setFilters(filters: Filters): void {
        this._filters.set(filters);
        this._page.set(DEFAULT_PAGINATION.page);
    }

    public patchFilters(partialFilters: Partial<Filters>): void {
        const current = this._filters() ?? ({} as Filters);
        this._filters.set({ ...current, ...partialFilters });
        this._page.set(DEFAULT_PAGINATION.page);
    }

    public clearFilters(): void {
        this._filters.set(this.getInitialFilters());
        this._page.set(DEFAULT_PAGINATION.page);
    }

    public reset(): void {
        this._filters.set(this.getInitialFilters());
        this._limit.set(DEFAULT_PAGINATION.limit);
        this._page.set(DEFAULT_PAGINATION.page);
    }

    public reload(): void {
        this.resource.reload();
    }
}
