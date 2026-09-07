import { Service } from '@angular/core';

@Service()
export class SecureStorageService {

    // 🛡️ Guarda la data ofuscada en localStorage (se borra al cerrar la pestaña)
    public saveItem(key: string, value: any): void {
        const jsonString = JSON.stringify(value);
        // 1. Codifica seguro para caracteres latinos y lo pasa a Base64
        const base64 = btoa(encodeURIComponent(jsonString));
        // 2. Trampa: Volteamos el string para que no sea reconocible en DevTools
        const obfuscated = base64.split('').reverse().join('');

        localStorage.setItem(key, obfuscated);
    }

    // 🛡️ Recupera y reconstruye la data
    public getItem(key: string): any {
        const data = localStorage.getItem(key);
        if (!data) return null;

        try {
            // 🛡️ Intento 1: Tratar de leerlo como si estuviera ofuscado (El nuevo estándar)
            const base64 = data.split('').reverse().join('');
            const jsonString = decodeURIComponent(atob(base64));
            return JSON.parse(jsonString);

        } catch (e) {

            // 🔄 Intento 2: Falló. ¿Es información antigua en texto plano? (Modo Migración)
            try {
                // Intentamos parsearlo normal
                const plainJson = JSON.parse(data);

                // ¡Bingo! Era data vieja. La actualizamos al formato seguro inmediatamente.
                console.log(`Migrando [${key}] a formato seguro...`);
                this.saveItem(key, plainJson);

                return plainJson; // Retornamos la data sin cortar la sesión

            } catch (errorPlano) {
                // Si llegamos aquí, ni es ofuscado ni es JSON válido. Es basura o manipulación real.
                console.warn('Intento de manipulación de Storage detectado o data corrupta.');
                this.clearItem(key);
                return null;
            }
        }
    }

    public clearItem(key: string): void {
        localStorage.removeItem(key);
    }
}