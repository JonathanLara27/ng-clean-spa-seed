import { inject, Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { CustomerState } from "../../../application/state/customer.state";
import { MasterTableManagerService } from "../../../../../core/services/master-table-manager.service";
import { PageHeaderConfig } from "../../../../../shared/components/page-header/page-header.interface";
import { ActionEvent, TableAction, TableColumn } from "../../../../../shared/components/reusable-table/table-config.interface";
import { Customer } from "../../../domain/entities";
import { GenericUpsertModal, GenericUpsertModalConfig } from "../../../../../shared/components/generic-upsert-modal/generic-upsert-modal";

@Injectable()
export class CustomerSectionService {
    public state = inject(CustomerState);
    private dialog = inject(MatDialog);

    private tableManager = inject(MasterTableManagerService);

    public searchControl = new FormControl<string>('');

    public headerConfig: PageHeaderConfig = {
        title: 'Demo Tabla Clientes',
        subtitle: '',
        actionButton: {
            text: 'Nuevo Cliente',
            icon: 'add_circle_outline',
        }
    }

    public columns: TableColumn<Customer>[] = [
        { key: 'fullName', label: 'Nombre completo', type: 'text' },
        { key: 'email', label: 'Correo electronico', type: 'text' },
        {
            key: 'isActive', label: 'Estado', type: 'badge', headerClass: 'text-center',
            cellClass: (row) => row.isActive === 'Activo' ? 'text-center badge-activo' : 'text-center badge-inactivo'
        },
    ];

    public actions: TableAction<Customer>[] = [
        { id: 'edit', label: 'Editar', icon: 'edit', color: 'accent' },
        { id: 'activar', label: 'Activar', icon: 'task_alt', color: 'accent', showIf: (row) => row.isActive === 'Inactivo' },
        { id: 'inactivar', label: 'Inactivar', icon: 'block', color: 'accent', showIf: (row) => row.isActive === 'Activo' },
    ];

    public init(): void {
        this.state.loadData();
    }

    public onPageChange(page: number): void {
        this.state.changePage(page);
    }

    public onPageSizeChange(limit: number): void {
        this.state.changeLimit(limit);
    }

    public onAction(event: ActionEvent<Customer>): void {
        switch (event.actionId) {
            case 'edit': return this.openModalUpsert(event.row);
            case 'activar': return this.changeState(event.row, 'Activo');
            case 'inactivar': return this.changeState(event.row, 'Inactivo');
        }
    }

    public openModalUpsert(entity?: Customer): void {
        const isEdit = !!entity;

        const dialogRef = this.dialog.open(GenericUpsertModal, {
            width: '450px',
            panelClass: 'custom-dialog-surface',
            data: {
                title: isEdit ? 'Editar cliente' : 'Nuevo cliente',
                inputLabel: 'Nombre completo',
                inputPlaceholder: 'Ej. Juan Perez',
                inputValue: isEdit ? entity.fullName : null,
            } as GenericUpsertModalConfig
        });

        const successMessage = isEdit ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.';

        this.tableManager.handleUpsert(
            dialogRef,
            successMessage,
            (result: string) => isEdit
                ? this.state.edit(entity.id, { firstName: result })
                : this.state.createNew({ firstName: result })
        );
    }

    private changeState(entity: Customer, newState: 'Activo' | 'Inactivo'): void {
        this.tableManager.handleChangeState(
            entity.fullName,
            newState,
            (result: string) => this.state.changeState(entity.id, newState, result)
        );
    }
}