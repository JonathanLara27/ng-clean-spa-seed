import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs";
import { LocalPaginationService } from "../../../../../core/services/local-pagination-manager.service";
import { TableColumn } from "../../../../../shared/components/reusable-table/table-config.interface";
import { DEBOUNCE_TIME_TO_SEARCH } from "../../../../../shared/constants/debounceTimeToSearch";
import { HistoryRowUI } from "../../../domain/entities/history.entity";

export const PAGINACION_KEY_ESTADOS = 'paginacion_estados';
export const PAGINACION_KEY_CAMBIOS = 'paginacion_cambios';

@Injectable()
export class HistoryDialogService {
    private destroyRef = inject(DestroyRef);
    private _activeView = signal<'states' | 'changes'>('states');
    public activeView = this._activeView.asReadonly();

    private _isLoadingView = signal<boolean>(false);
    public isTableLoading = this._isLoadingView.asReadonly();

    public readonly pagination = inject(LocalPaginationService);
    public readonly keyPaginacionEstados = PAGINACION_KEY_ESTADOS;
    public readonly keyPaginacionCambios = PAGINACION_KEY_CAMBIOS;

    public searchControlEstado = new FormControl<string>('');
    public searchControlCambios = new FormControl<string>('');

    private viewTimeout: ReturnType<typeof setTimeout> | null = null;
    public title = computed(() => `${this._activeView() === 'changes' ? 'Historial de Cambios' : 'Historial de Estado'}`);

    public activePaginationKey = computed(() =>
        this._activeView() === 'states' ? this.keyPaginacionEstados : this.keyPaginacionCambios
    );

    public activeStore = computed(() =>
        this.pagination.getStore<HistoryRowUI>(this.activePaginationKey())
    );

    public activeSearchControl = computed(() =>
        this._activeView() === 'states' ? this.searchControlEstado : this.searchControlCambios
    );

    public tableColumns = computed<TableColumn<HistoryRowUI>[]>(() => {
        return [
            {
                key: 'fecha',
                label: 'Fecha',
                type: 'text',
                headerClass: 'w-150',
                cellClass: 'w-150'
            },
            { key: 'usuario', label: 'Usuario', type: 'text' },
            this._activeView() === 'states' ? null : { key: 'campoStack', label: 'Campo', type: 'text' },
            { key: 'anteriorStack', label: 'Anterior', type: 'text' },
            { key: 'nuevoStack', label: 'Nuevo', type: 'text' },
            this._activeView() === 'states' ? { key: 'motivo', label: 'Motivo de cambio', type: 'text' }
                : null
        ].filter(col => col !== null) as TableColumn<HistoryRowUI>[];
    });


    constructor() {
        this.initLocalPaginators();
        this.setupSearchListeners();
        this.destroyRef.onDestroy(() => this.destroyLocalPaginators());
    }

    public changeView(view: 'states' | 'changes'): void {
        if (this._activeView() === view) return;

        // Activar loader visual
        this._isLoadingView.set(true);
        this._activeView.set(view);

        // Limpiar timer previo si se cambia rápido de pestaña
        if (this.viewTimeout) clearTimeout(this.viewTimeout);

        this.viewTimeout = setTimeout(() => {
            this._isLoadingView.set(false);
        }, 500);
    }

    public setDataPaginationLocalEstados(data: HistoryRowUI[]) {
        this.pagination.setData(PAGINACION_KEY_ESTADOS, data)
    }

    public setDataPaginationLocalCambios(data: HistoryRowUI[]) {
        this.pagination.setData(PAGINACION_KEY_CAMBIOS, data)
    }

    private initLocalPaginators() {
        this.pagination.init<HistoryRowUI>(PAGINACION_KEY_ESTADOS, 10, ['fecha', 'usuario', 'anteriorStack', 'nuevoStack', 'motivo']);
        this.pagination.init<HistoryRowUI>(PAGINACION_KEY_CAMBIOS, 10, ['fecha', 'usuario', 'campoStack', 'anteriorStack', 'nuevoStack']);
    }

    private setupSearchListeners() {
        this.searchControlEstado.valueChanges.pipe(debounceTime(DEBOUNCE_TIME_TO_SEARCH), takeUntilDestroyed(this.destroyRef))
            .subscribe(term => this.pagination.setSearchTerm(PAGINACION_KEY_ESTADOS, term || ''));

        this.searchControlCambios.valueChanges.pipe(debounceTime(DEBOUNCE_TIME_TO_SEARCH), takeUntilDestroyed(this.destroyRef))
            .subscribe(term => this.pagination.setSearchTerm(PAGINACION_KEY_CAMBIOS, term || ''));
    }

    private destroyLocalPaginators() {
        this.pagination.destroyStore(PAGINACION_KEY_ESTADOS)
        this.pagination.destroyStore(PAGINACION_KEY_CAMBIOS)
    }
}
