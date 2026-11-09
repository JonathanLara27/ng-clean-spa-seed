import { inject, Injectable, Injector, ResourceRef, Service } from '@angular/core';
import { IndexedDbConfig, IndexedDbResourceOptions } from '../interfaces/indexed-db.interface';
import { IndexedDbStore } from './indexed-db.store';

@Service()
export class IndexedDbService {
    private readonly injector = inject(Injector);

    /** Pool de promesas de conexión para evitar múltiples aperturas concurrentes (Performance / Clean Code) */
    private readonly connectionPool = new Map<string, Promise<IDBDatabase>>();

    /** Configuración por defecto para retrocompatibilidad con borradores de archivos */
    public static readonly DEFAULT_CONFIG: IndexedDbConfig = {
        dbName: 'CUSTOM_NAME',
        version: 1,
        storeName: 'DraftAttachments'
    };

    /**
     * Abre y reutiliza conexiones a la base de datos de manera segura y eficiente.
     */
    public getDbConnection(dbName: string, version: number = 1, storeName: string): Promise<IDBDatabase> {
        const poolKey = `${dbName}_v${version}`;
        const existingConnection = this.connectionPool.get(poolKey);

        if (existingConnection) {
            return existingConnection;
        }

        const connectionPromise = new Promise<IDBDatabase>((resolve, reject) => {
            if (typeof indexedDB === 'undefined') {
                reject(new Error('IndexedDB no está disponible en este entorno de ejecución (ej. SSR).'));
                return;
            }

            const request = indexedDB.open(dbName, version);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };

            request.onsuccess = (event: Event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Limpieza del pool si la conexión se cierra o cambia de versión
                db.onclose = () => this.connectionPool.delete(poolKey);
                db.onversionchange = () => {
                    db.close();
                    this.connectionPool.delete(poolKey);
                };

                resolve(db);
            };

            request.onerror = (event: Event) => {
                this.connectionPool.delete(poolKey);
                reject((event.target as IDBOpenDBRequest).error ?? new Error('Error al abrir conexión con IndexedDB'));
            };
        });

        this.connectionPool.set(poolKey, connectionPromise);
        return connectionPromise;
    }

    /**
     * Fábrica de Stores tipados (Factory Pattern).
     * Permite instanciar un repositorio para cualquier base de datos y tabla con parámetros dinámicos.
     */
    public createStore<T = unknown>(config: IndexedDbConfig): IndexedDbStore<T> {
        return new IndexedDbStore<T>(
            config,
            (dbName, version, storeName) => this.getDbConnection(dbName, version, storeName),
            this.injector
        );
    }

    /**
     * Utilidad reactiva directa: Genera un `ResourceRef` para una DB y store dados.
     */
    public createResource<T = unknown>(
        config: IndexedDbConfig,
        keySignal: () => string | null | undefined,
        options?: IndexedDbResourceOptions<T>
    ): ResourceRef<T | null> {
        const store = this.createStore<T>(config);
        return store.asResource(keySignal, options);
    }

    // =========================================================================
    // MÉTODOS DE RETROCOMPATIBILIDAD (Evitan breaking changes en código existente)
    // =========================================================================
    public async saveFiles(key: string, files: File[], config: IndexedDbConfig = IndexedDbService.DEFAULT_CONFIG): Promise<void> {
        const store = this.createStore<File[]>(config);
        await store.set(key, files);
    }

    public async getFiles(key: string, config: IndexedDbConfig = IndexedDbService.DEFAULT_CONFIG): Promise<File[] | null> {
        const store = this.createStore<File[]>(config);
        return store.get(key);
    }

    public async clearFiles(key: string, config: IndexedDbConfig = IndexedDbService.DEFAULT_CONFIG): Promise<void> {
        const store = this.createStore<File[]>(config);
        await store.delete(key);
    }
}