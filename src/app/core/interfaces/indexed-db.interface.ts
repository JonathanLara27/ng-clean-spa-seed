import { Injector, ResourceRef } from "@angular/core";

/**
 * Configuración necesaria para conectar con una base de datos y almacén en IndexedDB.
 */
export interface IndexedDbConfig {
    /** Nombre de la base de datos IndexedDB */
    dbName: string;
    /** Versión del esquema (por defecto 1) */
    version?: number;
    /** Nombre del ObjectStore (tabla/colección) */
    storeName: string;
}

/**
 * Opciones para la creación de un recurso reactivo basado en Angular Signals.
 */
export interface IndexedDbResourceOptions<T> {
    /** Valor por defecto mientras carga o si no se encuentra la clave */
    defaultValue?: T | null;
    /** Inyector opcional para desacoplar el ciclo de vida reactivo */
    injector?: Injector;
}

/**
 * Contrato de operaciones disponibles en un Store de IndexedDB (ISP).
 */
export interface IIndexedDbStore<T> {
    get(key: string): Promise<T | null>;
    set(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    getAll(): Promise<T[]>;
    keys(): Promise<string[]>;
    asResource(
        keySignal: () => string | null | undefined,
        options?: IndexedDbResourceOptions<T>
    ): ResourceRef<T | null>;
}