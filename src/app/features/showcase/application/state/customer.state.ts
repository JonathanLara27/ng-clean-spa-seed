import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomerApiService } from '../../infrastructure/apis/customer-api.service';
import { Customer, CustomerWritePayload } from '../../domain/entities/customer.entity';
import { CustomerFiltrosDTO, ReqCustomerCreate } from '../../infrastructure/dtos/customer.dto';
import { BaseCrudStateV2 } from '../../../../core/states/base-crud-v2.state';

@Injectable({ providedIn: 'root' })
export class CustomerState extends BaseCrudStateV2<Customer, CustomerFiltrosDTO, CustomerWritePayload> {
    
    private readonly api = inject(CustomerApiService);

    // ==========================================
    // IMPLEMENTACIÓN DE CONTRATOS
    // ==========================================

    protected getEntityName(): string {
        return 'Cliente';
    }

    protected fetchRequest(page: number, limit: number, filters: CustomerFiltrosDTO): Observable<{ data: Customer[]; total: number; }> {
        // Mapeamos los parámetros de la clase base a la firma de tu API
        return this.api.getData({
            pagination: { page, per_page: limit },
            filters
        });
    }

    protected createRequest(data: CustomerWritePayload): Observable<any> {
        return this.api.create(data.firstName);
    }

    protected updateRequest(id: string | number, data: CustomerWritePayload): Observable<any> {
        // Mapeamos el payload limpio de la UI al DTO que espera el API
        const updatePayload: Partial<ReqCustomerCreate> = {
            first_name: data.firstName,
            // last_name: data.lastName,
            // email_address: data.email
        };
        return this.api.update(Number(id), updatePayload);
    }

    protected changeStatusRequest(id: string | number, status: boolean, motivo?: string): Observable<any> {
        return this.api.changeStatus(Number(id), status, motivo || 'Actualización desde UI');
    }

    protected deleteRequest(id: string | number): Observable<any> {
        // Como el delete estaba vacío en el API Service, devolvemos un Observable nulo simulado
        console.warn(`Simulando eliminación del registro ${id}`);
        return of(null);
    }

    // ==========================================
    // HOOKS OPCIONALES
    // ==========================================
    
    protected override onAfterMutate(): void {
        // Aquí podrías agregar lógica extra después de crear/editar, 
        // como actualizar los lookups
        console.log(`[CustomerStore] Mutación exitosa. Recargando tabla...`);
    }
}