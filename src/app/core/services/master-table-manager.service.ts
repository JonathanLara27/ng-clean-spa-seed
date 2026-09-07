import { Injectable, Service, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ActionDialogComponent } from '../../shared/components/action-dialog/action-dialog.component';
import { APP_DIALOGS } from '../../shared/components/action-dialog/action-dialog.config';
import { sliceText } from '../../shared/helpers/sliceText.helper';
import { NotificationService } from './notification.service';

@Service()
export class MasterTableManagerService {
    private dialog = inject(MatDialog);
    private notify = inject(NotificationService);

    // =========================================
    // UPSERT ORQUESTADO
    // =========================================
    public async handleUpsert(
        dialogRef: MatDialogRef<any, any>,
        successMessage: string,
        actionFn: (result: any) => Promise<void>
    ): Promise<void> {
        const result = await firstValueFrom(dialogRef.afterClosed());
        if (!result) return;

        await this.executeWithNotification(
            () => actionFn(result),
            successMessage // 🚀 Lo usamos directamente
        );
    }

    // =========================================
    // CAMBIO DE ESTADO
    // =========================================
    public async handleChangeState(
        entityDisplayName: string,
        newState: 'Activo' | 'Inactivo',
        actionFn: (result: string) => Promise<void>
    ): Promise<void> {
        const dialogRef = this.dialog.open(ActionDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-surface',
            data: {
                ...APP_DIALOGS.confirmacionConMotivo,
                title: `¿Confirma que desea cambiar el estado a "${newState}"?`,
                subtitle: sliceText(entityDisplayName, 50),
                cancelText: 'No, cancelar',
                confirmText: `Sí, cambiar`,
                inputLabel: 'Motivo del cambio',
            }
        });

        const result = await firstValueFrom(dialogRef.afterClosed());
        if (!result) return;

        await this.executeWithNotification(
            () => actionFn(result),
            `Estado cambiado a ${newState} correctamente.`
        );
    }

    // =========================================
    // ELIMINACIÓN
    // =========================================
    public async handleDelete(
        modalTitle: string,
        entityDisplayName: string,
        successMessage: string,
        actionFn: (result: string) => Promise<void>
    ): Promise<void> {
        const dialogRef = this.dialog.open(ActionDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-surface',
            data: {
                ...APP_DIALOGS.eliminar,
                title: modalTitle, // 🚀 Usamos el título exacto
                subtitle: sliceText(entityDisplayName, 50),
            }
        });

        const result = await firstValueFrom(dialogRef.afterClosed());
        if (!result) return;

        await this.executeWithNotification(
            () => actionFn(result),
            successMessage // 🚀 Usamos el mensaje exacto
        );
    }

    // =========================================
    // WRAPPER DE MANEJO DE ERRORES
    // =========================================
    private async executeWithNotification(action: () => Promise<void>, successMsg: string): Promise<void> {
        try {
            await action();
            this.notify.success(successMsg);
        } catch (error) {
            // 🚀 FIX: Ya no disparamos this.notify.error() aquí porque el BaseCrudState
            // this.notify.error(`Ocurrió un error al procesar la operación.`);
            console.error('[TableManager Operation Failed]', error);
        }
    }
}