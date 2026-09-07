import { Pipe, PipeTransform } from "@angular/core";
import { TableColumn } from "../../shared/components/reusable-table/table-config.interface";
// 🚀 PIPE 1: Resuelve valor y clases de la celda de forma memorizada
@Pipe({
    name: 'tableCell',
    standalone: true,
    pure: true // 👈 Evita ejecuciones repetitivas en cada Change Detection
})
export class TableCellPipe<T> implements PipeTransform {
    transform(row: T, col: TableColumn<T>, type: 'value' | 'class'): any {
        if (type === 'value') {
            return col.formatter ? col.formatter(row) : (row as Record<string, any>)[col.key];
        }
        if (type === 'class') {
            if (!col.cellClass) return '';
            return typeof col.cellClass === 'function' ? col.cellClass(row) : col.cellClass;
        }
        return null;
    }
}