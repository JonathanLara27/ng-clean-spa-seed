import { Injector, ResourceRef, resource } from "@angular/core";
import { IIndexedDbStore, IndexedDbConfig, IndexedDbResourceOptions } from "../interfaces/indexed-db.interface";

/**
 * Representa un almacén tipado y aislado para una combinación específica de DB y Store.
 * Aplica el principio de Responsabilidad Única (SRP) para operaciones CRUD y reactivas.
 */
export class IndexedDbStore<T = unknown> implements IIndexedDbStore<T> {
    private readonly version: number;

    constructor(
        private readonly config: IndexedDbConfig,
        private readonly connectionProvider: (dbName: string, version: number, storeName: string) => Promise<IDBDatabase>,
        private readonly injector?: Injector
    ) {
        this.version = config.version ?? 1;
    }

    /**
     * Ejecuta una transacción genérica en el store encapsulando el manejo de eventos (DRY / Clean Code).
     */
    private async performTransaction<R>(
        mode: IDBTransactionMode,
        operation: (store: IDBObjectStore) => IDBRequest<R>
    ): Promise<R> {
        const db = await this.connectionProvider(this.config.dbName, this.version, this.config.storeName);

        return new Promise<R>((resolve, reject) => {
            try {
                const transaction = db.transaction(this.config.storeName, mode);
                const store = transaction.objectStore(this.config.storeName);
                const request = operation(store);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error ?? new Error('Error al ejecutar operación en IndexedDB'));
                transaction.onerror = () => reject(transaction.error ?? new Error('Error en la transacción IndexedDB'));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Recupera un registro por su clave.
     */
    public async get(key: string): Promise<T | null> {
        const result = await this.performTransaction<T | undefined>('readonly', store => store.get(key));
        return result ?? null;
    }

    /**
     * Almacena o actualiza un registro por su clave.
     */
    public async set(key: string, value: T): Promise<void> {
        await this.performTransaction<IDBValidKey>('readwrite', store => store.put(value, key));
    }

    /**
     * Elimina un registro por su clave.
     */
    public async delete(key: string): Promise<void> {
        await this.performTransaction<undefined>('readwrite', store => store.delete(key));
    }

    /**
     * Vacía por completo el store.
     */
    public async clear(): Promise<void> {
        await this.performTransaction<undefined>('readwrite', store => store.clear());
    }

    /**
     * Obtiene todos los registros del store.
     */
    public async getAll(): Promise<T[]> {
        const result = await this.performTransaction<T[]>('readonly', store => store.getAll());
        return result ?? [];
    }

    /**
     * Lista todas las claves disponibles en el store.
     */
    public async keys(): Promise<string[]> {
        const result = await this.performTransaction<IDBValidKey[]>('readonly', store => store.getAllKeys());
        return (result ?? []).map(k => String(k));
    }

    /**
     * Conecta el almacén de IndexedDB con la API reactiva `resource` de Angular 22.
     * Lee automáticamente el dato cuando el Signal de la clave cambia.
     *
     * @param keySignal Función o Signal que emite la clave a consultar.
     * @param options Configuración de valor por defecto e inyector.
     */
    public asResource(
        keySignal: () => string | null | undefined,
        options?: IndexedDbResourceOptions<T>
    ): ResourceRef<T | null> {
        return resource<T | null, string | undefined>({
            injector: options?.injector ?? this.injector,
            defaultValue: options?.defaultValue ?? null,
            params: () => {
                const key = keySignal();
                return key ? key : undefined;
            },
            loader: async ({ params, abortSignal }) => {
                if (abortSignal.aborted) return null;
                const result = await this.get(params);
                if (abortSignal.aborted) return null;
                return result;
            }
        });
    }
}