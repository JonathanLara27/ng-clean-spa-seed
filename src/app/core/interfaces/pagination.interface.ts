export interface PaginationParams {
    page: number;
    limit: number;
}

export interface Pagination extends PaginationParams {
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
export interface PaginatedState<T, F> {
    data: T[];
    isLoading: boolean;
    error: string | null;
    page: number;
    limit: number;
    total: number;
    filters: F | null; // Guardamos los filtros activos aquí
}

export const DEFAULT_PAGINATION: PaginationParams = {
    page: 1,
    limit: 5
};

export const INIT_PAGINATED_STATE = <T, F>(defaultLimit = DEFAULT_PAGINATION.limit): PaginatedState<T, F> => ({
    data: [],
    isLoading: false,
    error: null,
    page: 1,
    limit: defaultLimit,
    total: 0,
    filters: null
});


// 🔥 TypeORM Standard Operators
export type TypeOrmOperator =
    | 'eq'       // Equal
    | 'neq'      // Not Equal
    | 'gt'       // Greater Than
    | 'gte'      // Greater Than or Equal
    | 'lt'       // Less Than
    | 'lte'      // Less Than or Equal
    | 'like'     // Like (%value%)
    | 'ilike'    // ILike (Case insensitive %value%)
    | 'in'       // In array
    | 'between'; // Between two values

export interface FilterParam {
    key: string;
    operator: TypeOrmOperator;
    value: any;
}

export const PAGE_SIZE_OPTIONS_DEFAULT = [10, 20, 50, 75, 100];