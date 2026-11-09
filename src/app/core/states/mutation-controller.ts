import { inject, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export class MutationController {
    private readonly notify = inject(NotificationService);
    
    private _isMutating = signal<boolean>(false);
    public isMutating = this._isMutating.asReadonly();

    /**
     * Ejecuta una mutación (Create, Update, Delete, ChangeStatus)
     * @param operationName Nombre de la operación para el Toast (ej: 'crear usuario')
     * @param request$ El observable de la petición HTTP
     * @param onSuccess Callback opcional al terminar (ej: recargar tabla)
     */
    public async execute(operationName: string, request$: Observable<any>, onSuccess?: () => void): Promise<void> {
        this._isMutating.set(true);
        try {
            await firstValueFrom(request$);
            onSuccess?.();
        } catch (error: any) {
            this.notify.error(`Error al ${operationName}`);
            throw error;
        } finally {
            this._isMutating.set(false);
        }
    }
}