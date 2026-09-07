import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, Pipe, PipeTransform, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionEvent, TableAction, TableColumn, TableTexts } from './table-config.interface';
import { URL_SVGS } from '../../constants/assetsUrl';
import { TableCellPipe } from '../../../core/pipes/tableCell.pipe';
import { TableActionPipe } from '../../../core/pipes/tableAction.pipe';

export const REUSABLE_TABLE_DEFAULT_TEXTS: TableTexts = {
  actionsTitle: 'Acciones',
  emptyState: 'No se encontraron registros.',
  expandTooltip: 'Mostrar más',
  collapseTooltip: 'Ocultar'
};

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,

    TableCellPipe,
    TableActionPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reusable-table.html',
  styleUrls: ['./reusable-table.scss']
})
export class ReusableTableComponent<T extends Record<string, any>> {

  public baseUrlSvgs = signal<string>(URL_SVGS);

  // 🔥 1. Recibimos un objeto parcial (opcional)
  public customTexts = input<Partial<TableTexts>>({});

  // 🔥 2. Unimos los textos por defecto con los personalizados
  // Si envías un actionsTitle, sobrescribe el por defecto. Si no, usa "Acciones".
  public texts = computed<TableTexts>(() => ({
    ...REUSABLE_TABLE_DEFAULT_TEXTS,
    ...this.customTexts()
  }));

  public data = input.required<T[]>();
  public columns = input.required<TableColumn<T>[]>();
  public actions = input<TableAction<T>[]>([]);

  public maxActionsVisible = input<number>(3);
  public actionsGridCols = input<number>(2);
  public searchTerm = input<string>('');

  public isLoading = input<boolean>(false);

  public actionsCellClass = input<string>('');

  public maxHeight = input<string>('500px'); // Ej: '350px'

  public actionClicked = output<ActionEvent<T>>();

  public expandedRows = signal<Set<number>>(new Set<number>());

  public filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const currentData = this.data();
    if (!term) return currentData;

    const activeKeys = this.columns().map(c => c.key);

    return currentData.filter(row =>
      activeKeys.some(key => {
        const val = row[key];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
      })
    );
  });

  // 🧮 Lógica: ¿Agrupamos en menú o mostramos sueltos?
  public showAsMenu = computed(() => this.actions().length >= this.maxActionsVisible());

  public getCellValue(col: TableColumn<T>, row: T): any {
    if (col.formatter) {
      return col.formatter(row);
    }
    return row[col.key];
  }

  public onAction(actionId: string, row: T): void {
    this.actionClicked.emit({ actionId, row });
  }

  public toggleRowExpansion(rowIndex: number): void {
    this.expandedRows.update(set => {
      const newSet = new Set(set);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  }

  public isRowExpanded(rowIndex: number): boolean {
    return this.expandedRows().has(rowIndex);
  }

  public getVisibleActions(row: T): TableAction<T>[] {
    return this.actions().filter(action => !action.showIf || action.showIf(row));
  }
}