import { Customer } from "../../domain/entities";
import { CustomerDTO } from "../dtos";

export class CustomerMapper {
    static fromDtoToEntity(dto: CustomerDTO): Customer {
        return {
            id: dto.id_customer,
            fullName: `${dto.first_name} ${dto.last_name}`,
            email: dto.email_address,
            isActive: dto.is_active ? 'Activo' : 'Inactivo',
            createdAt: new Date(dto.created_at)
        };
    }
}