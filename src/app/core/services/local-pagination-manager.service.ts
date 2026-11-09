import { Injectable, computed, signal, WritableSignal, Signal, Service } from '@angular/core';

export interface TablePaginationState<T extends Record<string, any>> {
    rawData: WritableSignal<T[]>;
    currentPage: WritableSignal<number>;
    pageSize: WritableSignal<number>;
    searchTerm: WritableSignal<string>;
    // Computeds cacheados
    filteredData: Signal<T[]>;
    paginatedData: Signal<T[]>;
    totalItems: Signal<number>;
}

@Service()
export class LocalPaginationService {
    private stores = new Map<string, TablePaginationState<any>>();

    public init<T extends Record<string, any>>(key: string, defaultPageSize = 10, searchKeys: (keyof T)[] = []): void {
        if (this.stores.has(key)) return;

        const rawData = signal<T[]>([]);
        const currentPage = signal<number>(1);
        const pageSize = signal<number>(defaultPageSize);
        const searchTerm = signal<string>('');

        const filteredData = computed(() => {
            const term = searchTerm().toLowerCase().trim();
            const data = rawData();
            if (!term) return data;
            
            return data.filter(item => {
                // ✅ Ahora TypeScript confía en que 'item' es un objeto y permite Object.keys()
                const keys = searchKeys.length ? searchKeys : Object.keys(item) as (keyof T)[];
                return keys.some(k => String(item[k]).toLowerCase().includes(term));
            });
        });

        const paginatedData = computed(() => {
            const start = (currentPage() - 1) * pageSize();
            return filteredData().slice(start, start + pageSize());
        });

        const totalItems = computed(() => filteredData().length);

        this.stores.set(key, {
            rawData, currentPage, pageSize, searchTerm,
            filteredData, paginatedData, totalItems
        });
    }

    // 🚀 FIX: Aplicamos la restricción en el getter
    public getStore<T extends Record<string, any>>(key: string): TablePaginationState<T> {
        const store = this.stores.get(key);
        if (!store) throw new Error(`El paginador '${key}' no ha sido inicializado.`);
        return store as TablePaginationState<T>;
    }

    public setData(key: string, data: any[]): void {
        const store = this.getStore(key);
        store.rawData.set(data);
        store.currentPage.set(1);
    }

    public setPage(key: string, page: number): void {
        this.getStore(key).currentPage.set(page);
    }

    public setPageSize(key: string, size: number): void {
        const store = this.getStore(key);
        store.pageSize.set(size);
        store.currentPage.set(1);
    }

    public setSearchTerm(key: string, term: string): void {
        const store = this.getStore(key);
        store.searchTerm.set(term);
        store.currentPage.set(1);
    }

    public destroyStore(key: string): void {
        this.stores.delete(key);
    }
}