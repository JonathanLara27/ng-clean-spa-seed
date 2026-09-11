import { Service } from '@angular/core';
import { delay, map, Observable, of, switchMap } from 'rxjs';
import { PaginationReqDTO } from '../../../../core/dtos';
import { CustomerLookup } from '../../domain/entities';
import { CustomerDTO, CustomerFiltrosDTO, ReqCustomerCreate, RespCustomerUpsert } from '../dtos';
import { CustomerMapper } from '../mappers/customer.mapper';

// 🔹 Cambiado a 'let' para permitir reasignación en el método delete
let MOCK_DB: CustomerDTO[] = Array.from({ length: 45 }, (_, i) => ({
    id_customer: i + 1,
    first_name: `Usuario`,
    last_name: `Demo ${i + 1}`,
    email_address: `usuario${i + 1}@empresa.com`,
    is_active: i % 4 !== 0,
    created_at: new Date(new Date().setDate(new Date().getDate() - i)).toISOString()
}));

@Service()
export class CustomerApiService {

    getData(params: { pagination: PaginationReqDTO, filters?: CustomerFiltrosDTO }) {
        let filtered = [...MOCK_DB];

        // 🔥 FIX 1: Ordenar por fecha descendente (Los más nuevos primero)
        // Esto asegura que al crear un registro, aparezca instantáneamente en la Página 1.
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // 1. Aplicar Filtros
        if (params.filters?.name) {
            const searchTerm = params.filters.name.toLowerCase();
            filtered = filtered.filter(c =>
                c.first_name.toLowerCase().includes(searchTerm) ||
                c.last_name.toLowerCase().includes(searchTerm)
            );
        }
        if (params.filters?.es_activo !== undefined) {
            filtered = filtered.filter(c => c.is_active === params.filters!.es_activo);
        }

        // 2. Aplicar Paginación (Casteo estricto a Number para evitar concatenaciones)
        const page = Number(params.pagination.page);
        const limit = Number(params.pagination.per_page);

        const total = filtered.length;
        const start = (page - 1) * limit;

        // Ahora sí sumará correctamente: 40 + 5 = 45
        const paginatedData = filtered.slice(start, start + limit);

        // 3. Devolver formato mapeado
        return of({
            data: paginatedData.map(CustomerMapper.fromDtoToEntity),
            limit: limit,
            page: page,
            total: total
        }).pipe(delay(600));
    }

    public getPureAll(): Observable<CustomerLookup[]> {
        const filters: CustomerFiltrosDTO = { es_activo: true };

        return this.getData({ pagination: { page: 1, per_page: 1 }, filters }).pipe(
            switchMap(firstResp => {
                const total = firstResp.total;
                if (total === 0) return of([]);

                return this.getData({ pagination: { page: 1, per_page: total }, filters }).pipe(
                    map(res => res.data.map(row => ({
                        id: row.id,
                        nombre: row.fullName
                    })))
                );
            })
        );
    }

    create(fullName: string): Observable<RespCustomerUpsert> {
        // 🔥 FIX 2: Generar un ID seguro basado en el máximo actual, no en el length.
        const newId = MOCK_DB.length > 0 ? Math.max(...MOCK_DB.map(c => c.id_customer)) + 1 : 1;

        const req: ReqCustomerCreate = { first_name: fullName, is_active: true, es_activo_origen: 'USUARIO' };
        console.log('Simulando POST', req);

        MOCK_DB.push({
            id_customer: newId,
            first_name: fullName,
            last_name: '', // Podrías dividir fullName si quisieras
            email_address: `usuario${newId}@empresa.com`,
            is_active: true,
            created_at: new Date().toISOString() // La fecha actual lo pondrá de primero gracias al sort
        });

        return of({ status: 'success', data: { id_customer: newId }, pagination: null }).pipe(delay(500));
    }

    update(id: number, reqUpdate: Partial<ReqCustomerCreate>) {
        console.log(`Simulando PATCH /customer/${id}`, reqUpdate);

        const index = MOCK_DB.findIndex(c => c.id_customer === id);
        if (index !== -1) {
            // 🔥 FIX 3: Hacemos un merge dinámico de TODAS las propiedades que vengan en reqUpdate
            MOCK_DB[index] = { ...MOCK_DB[index], ...reqUpdate };
        }
        return of({ status: 'success', data: { id_customer: id }, pagination: null }).pipe(delay(500));
    }

    changeStatus(id: number, status: boolean, motivo_cambio: string) {
        console.log(`Simulando PATCH /customer/${id}/status`, { status, motivo_cambio });

        const index = MOCK_DB.findIndex(c => c.id_customer === id);
        if (index !== -1) {
            MOCK_DB[index] = { ...MOCK_DB[index], is_active: status };
        }
        return of({ status: 'success', data: { id_customer: id }, pagination: null }).pipe(delay(500));
    }

    // 🔥 EXTRA: Método delete para probar la eliminación sin romper nada
    delete(id: number) {
        console.log(`Simulando DELETE /customer/${id}`);
        MOCK_DB = MOCK_DB.filter(c => c.id_customer !== id);
        return of({ status: 'success', data: null, pagination: null }).pipe(delay(500));
    }
}