import { PaginationRespDTO } from "../../../../core/dtos";

export interface CustomerDTO {
    id_customer: number;
    first_name: string;
    last_name: string;
    email_address: string;
    is_active: boolean;
    created_at: string;
}

export interface RespCustomerDTO {
    status: string;
    data: CustomerDTO[];
    pagination: PaginationRespDTO;
}

export interface CustomerFiltrosDTO {
    name?: string | null;
    es_activo?: boolean;
}

// export interface ReqCustomerCreate extends Pick<CustomerDTO, 'first_name' | 'last_name' | 'email_address' | 'is_active'> {
//     es_activo_origen: string;
// }
export interface ReqCustomerCreate extends Pick<CustomerDTO, 'first_name'| 'is_active'> {
    es_activo_origen: string;
}

export interface ReqCustomerUpdate extends Partial<ReqCustomerCreate> {
    motivo_cambio?: string;
}

export interface RespCustomerUpsert {
    status: string;
    data: Pick<CustomerDTO, 'id_customer'>;
    pagination: null;
}