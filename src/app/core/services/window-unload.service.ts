import { OnDestroy, Service } from '@angular/core';

@Service()
export class WindowUnloadService implements OnDestroy {

    private isDirty = false;
    private isListenerAttached = false;

    /**
     * 🚀 El manejador del evento. Usamos una arrow function para preservar el contexto de 'this'.
     */
    private readonly unloadHandler = (event: BeforeUnloadEvent): void | string => {
        if (this.isDirty) {
            // Estándar moderno para gatillar la alerta nativa del navegador
            event.preventDefault();
            // event.returnValue = ''; // Requerido por Chrome antiguo y otros motores
            return ''; // Requerido por algunos navegadores legacy
        }
    };

    /**
     * Activa la protección contra el cierre/F5 de la ventana.
     * Úsalo cuando el formulario pasa a estado "dirty".
     */
    public enableWarning(): void {
        this.isDirty = true;
        this.attachListener();
    }

    /**
     * Desactiva la protección.
     * Úsalo después de un guardado exitoso o si el usuario cancela la operación.
     */
    public disableWarning(): void {
        this.isDirty = false;
        this.detachListener();
    }

    /**
     * Solo adjunta el listener si no existe previamente, evitando fugas de memoria.
     */
    private attachListener(): void {
        if (!this.isListenerAttached) {
            window.addEventListener('beforeunload', this.unloadHandler);
            this.isListenerAttached = true;
        }
    }

    /**
     * Limpia el DOM removiendo el listener.
     */
    private detachListener(): void {
        if (this.isListenerAttached) {
            window.removeEventListener('beforeunload', this.unloadHandler);
            this.isListenerAttached = false;
        }
    }

    /**
     * Buena práctica de Clean Code: asegurar la limpieza si el servicio se destruye.
     */
    ngOnDestroy(): void {
        this.detachListener();
    }
}