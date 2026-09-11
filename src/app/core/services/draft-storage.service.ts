import { inject, Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';

@Injectable({
    providedIn: 'root'
})
export class DraftStorageService {

    private secureStorage = inject(SecureStorageService);

    /** Guarda un objeto en formato JSON en el Local Storage */
    public saveDraft<T>(key: string, data: T): void {
        try {
            this.secureStorage.saveItem(key, data);
            console.log(`💾 Borrador guardado [${key}]`);
        } catch (error) {
            console.error('Error al guardar el borrador:', error);
        }
    }

    /** Recupera y parsea un objeto del Local Storage */
    public getDraft<T>(key: string): T | null {
        try {
            const draft = this.secureStorage.getItem(key);
            return draft as T | null;
        } catch (error) {
            console.error('Error al leer el borrador:', error);
            return null;
        }
    }

    /** Elimina un borrador específico */
    public clearDraft(key: string): void {
        this.secureStorage.clearItem(key);
    }

    /** Verifica si existe un borrador */
    public hasDraft(key: string): boolean {
        return !!localStorage.getItem(key);
    }
}