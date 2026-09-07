// 🚀 TWrite por defecto es Partial<T> para mantener retrocompatibilidad
export interface CrudState<T, F, TWrite = Partial<T>> {
    loadData(): void;
    changePage(page: number): void;
    changeLimit(limit: number): void;
    setFilters(filters: F): void;
    
    // 🚀 Usamos TWrite en lugar de Partial<T>
    createNew(data: TWrite): Promise<void>;
    edit(id: number | string, data: TWrite): Promise<void>;
    
    changeState(id: number | string, state: string, motivo_cambio?: string): Promise<void>;
    delete(id: number | string): Promise<void>;
}