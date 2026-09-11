import { inject, Injectable, signal } from "@angular/core";
import { form, required, SchemaPathTree, submit } from "@angular/forms/signals";
import { MatDialog } from "@angular/material/dialog";
import { ActionDialogComponent } from "../../../../../shared/components/action-dialog/action-dialog.component";
import { APP_DIALOGS } from "../../../../../shared/components/action-dialog/action-dialog.config";
import { sliceText } from "../../../../../shared/helpers/sliceText.helper";
import { firstValueFrom } from "rxjs";
import { NotificationService } from "../../../../../core/services/notification.service";

export interface DeleteActionConfig {
    // modalTitle: string;
    entityDisplayName: string;
    succesMessage: string;
}

const INIT_DELETE_MODEL: DeleteActionConfig = {
    // modalTitle: '',
    entityDisplayName: '',
    succesMessage: '',
};

const DELETE_ACTION_SCHEMA = (schemaPath: SchemaPathTree<DeleteActionConfig>) => {
    // required(schemaPath.modalTitle, {
    //     message: 'El titulo es obligatorio'
    // });

    required(schemaPath.entityDisplayName, {
        message: 'La entidad es obligatoria'
    });

    required(schemaPath.succesMessage, {
        message: 'El mensaje es obligatorio'
    });
};

@Injectable()
export class ActionDialogSectionService {
    private dialog = inject(MatDialog);
    private notificationService = inject(NotificationService);
    private deleteModel = signal<DeleteActionConfig>(INIT_DELETE_MODEL);
    public deleteForm = form(this.deleteModel, DELETE_ACTION_SCHEMA);

    public async openDeleteAction(event: Event) {
        event.preventDefault();
        if (this.deleteForm().invalid()) {
            this.deleteForm().markAsTouched();
            return;
        }
        submit(this.deleteForm, async () => {
            const { entityDisplayName, succesMessage } = this.deleteModel();
            const dialogRef = this.dialog.open(ActionDialogComponent, {
                width: '400px',
                panelClass: 'custom-dialog-surface',
                data: {
                    ...APP_DIALOGS.eliminar,
                    subtitle: sliceText(entityDisplayName, 50),
                }
            });
            const result = await firstValueFrom(dialogRef.afterClosed());
            if (!result) return;

            this.notificationService.success(succesMessage);
        })
    }

    public async openConfirmationAction() {
        const dialogRef = this.dialog.open(ActionDialogComponent, {
            width: '400px',
            panelClass: 'custom-dialog-surface',
            data: {
                ...APP_DIALOGS.confirmacionGeneral,
            }
        })
        const result = await firstValueFrom(dialogRef.afterClosed());
        if (!result) return;

        this.notificationService.success('Accion realizada correctamente');
    }

    public async openUnsavedChanges() {
        const dialogRef = this.dialog.open(ActionDialogComponent, {
            width: '500px',
            panelClass: 'custom-dialog-surface',
            data: {
                ...APP_DIALOGS.cambiosSinGuardar,
            }
        })
        const result = await firstValueFrom(dialogRef.afterClosed());
        if (!result) return;

        this.notificationService.success('Accion realizada correctamente');
    }

}