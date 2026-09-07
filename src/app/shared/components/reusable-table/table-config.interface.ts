export type ColumnType = 'text' | 'badge' | 'array' | 'stacked';

export interface TableColumn<T> {
    // key: keyof T;
    key: string;
    label: string;
    type?: ColumnType;
    headerClass?: string;
    cellClass?: string | ((row: T) => string);
    formatter?: (row: T) => any;
}

export interface TableAction<T> {
    id: string;
    label: string;
    isTextButton?: boolean;
    svgIcon?: string;
    icon?: string;
    color?: 'primary' | 'accent' | 'warn' | string;

    actionClass?: string | ((row: T) => string);
    showIf?: (row: T) => boolean;
}

export interface ActionEvent<T> {
    actionId: string;
    row: T;
}

export interface TableTexts {
    actionsTitle: string;
    emptyState: string;
    expandTooltip: string;
    collapseTooltip: string;
}