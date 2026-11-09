export interface HistoryFieldConfig<T> {
    key: keyof T;
    label: string;
    formatter?: (value: T[keyof T]) =>string;
};

export interface HistoryRowUI {
    fecha: string;

    usuario: string;
    campoStack: string;
    anteriorStack: string;
    nuevoStack: string;
    motivo: string | null;
}

export interface ConfigHistoryState<T> {
    id: number;
    config: HistoryFieldConfig<T>[];
}