import { Pipe, PipeTransform } from "@angular/core";
import { TableAction } from "../../shared/components/reusable-table/table-config.interface";
// 🚀 PIPE 2: Resuelve acciones visibles y sus clases de forma memorizada
@Pipe({
    name: 'tableAction',
    standalone: true,
    pure: true
})
export class TableActionPipe<T> implements PipeTransform {
    transform(row: T, actionOrActions: any, type: 'visible' | 'class'): any {
        if (type === 'visible') {
            const actions = actionOrActions as TableAction<T>[];
            return actions.filter(action => !action.showIf || action.showIf(row));
        }
        if (type === 'class') {
            const action = actionOrActions as TableAction<T>;
            if (!action.actionClass) return '';
            return typeof action.actionClass === 'function' ? action.actionClass(row) : action.actionClass;
        }
        return null;
    }
}