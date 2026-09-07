import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReusableTableComponent } from '../reusable-table/reusable-table';
import { ActionEvent, TableAction, TableColumn, TableTexts } from '../reusable-table/table-config.interface';


export interface GenericEntitySelector<T> {
  title: string;
  placeholder: string;
  lookupData: T[];
  selectedData: T[];
  columns: TableColumn<T>[];
  idProp: keyof T;
  searchProp: keyof T;
  itemAdded: (item: T) => void;
  itemRemoved: (item: T) => void;
}


@Component({
  selector: 'app-generic-entity-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReusableTableComponent,
  ],
  templateUrl: './generic-entity-selector.html',
  styleUrl: './generic-entity-selector.scss',
})
export class GenericEntitySelectorComponent<T extends Record<string, any>> {

  public title = input.required<string>();
  public placeholder = input<string>('Buscar registro...');
  public lookupData = input.required<T[]>();
  public selectedData = input.required<T[]>();
  public columns = input.required<TableColumn<T>[]>();
  public idProp = input.required<keyof T>();
  public searchProp = input.required<keyof T>();

  public itemAdded = output<T>();
  public itemRemoved = output<T>();

  public customTableTexts: Partial<TableTexts> = {
    emptyState: 'Selecciona un item para que se muestre en la tabla',
  }

  // ✅ Configuración de acciones compatible con tu ReusableTable
  public tableActions: TableAction<T>[] = [
    {
      id: 'delete',
      label: 'Eliminar',
      icon: 'delete',
      color: 'warn'
    }
  ];

  public searchControl = new FormControl<string>('');
  public searchTerm = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  public filteredOptions = computed(() => {
    const term = (this.searchTerm() || '').toLowerCase().trim();
    const catalog = this.lookupData() || [];
    const selected = this.selectedData() || [];

    const availableItems = catalog.filter(catItem =>
      !selected.some(selItem => selItem[this.idProp()] === catItem[this.idProp()])
    );

    if (!term) return availableItems.slice(0, 20);

    return availableItems
      .filter(item => String(item[this.searchProp()]).toLowerCase().includes(term))
      .slice(0, 20);
  });

  public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedItem = event.option.value as T;
    this.itemAdded.emit(selectedItem);
    this.searchControl.setValue('', { emitEvent: true });
  }

  // ✅ Escuchador compatible con el ActionEvent de tu tabla
  public onTableAction(event: ActionEvent<T>): void {
    if (event.actionId === 'delete') {
      this.itemRemoved.emit(event.row);
    }
  }

  public displayFn = (item: T | null): string => {
    return item ? String(item[this.searchProp()]) : '';
  };
}