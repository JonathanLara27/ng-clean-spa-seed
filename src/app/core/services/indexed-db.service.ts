import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IndexedDbService {
    private readonly DB_NAME = 'CUSTOM_NAME';
    private readonly DB_VERSION = 1;
    private readonly STORE_NAME = 'DraftAttachments';

    /**
     * 1. CONEXIÓN: Abre la base de datos y crea la tabla si no existe.
     */
    private async getDb(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            // Si es la primera vez o cambió la versión, creamos el "ObjectStore" (la tabla)
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    // No usamos keyPath, funcionará como un diccionario Key-Value libre
                    db.createObjectStore(this.STORE_NAME);
                }
            };

            request.onsuccess = (event: Event) => resolve((event.target as IDBOpenDBRequest).result);
            request.onerror = (event: Event) => reject((event.target as IDBOpenDBRequest).error);
        });
    }

    /**
     * 2. GUARDAR (PUT): Almacena un array de objetos File (binarios puros)
     */
    public async saveFiles(key: string, files: File[]): Promise<void> {
        const db = await this.getDb();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.STORE_NAME, 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);

            // Guardamos la data pasando la llave explícitamente (out-of-line key)
            const request = store.put(files, key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 3. RECUPERAR (GET): Obtiene los archivos binarios
     */
    public async getFiles(key: string): Promise<File[] | null> {
        const db = await this.getDb();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.STORE_NAME, 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(key);

            request.onsuccess = () => {
                // request.result será undefined si no existe la llave
                resolve(request.result || null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 4. LIMPIAR (DELETE): Borra los archivos cuando ya se envió la cotización
     */
    public async clearFiles(key: string): Promise<void> {
        const db = await this.getDb();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.STORE_NAME, 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}