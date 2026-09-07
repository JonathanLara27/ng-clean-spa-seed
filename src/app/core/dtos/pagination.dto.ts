export interface PaginationRespDTO {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
}

export interface PaginationReqDTO {
    page: number;
    per_page: number;
}


export interface PaginationFilterDTO<T> {
    filters?: T,
    pagination: PaginationReqDTO
}