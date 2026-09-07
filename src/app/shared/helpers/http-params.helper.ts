import { HttpParams } from '@angular/common/http';
import { PaginationFilterDTO } from '../../core/dtos';

export class HttpParamsBuilder {

    public static buildPaginationFilter<T extends Record<string, any>>(data: PaginationFilterDTO<T>): HttpParams {
        let params = new HttpParams();

        params = this.appendObjectToParams(params, data.pagination);

        if (data.filters) {
            params = this.appendObjectToParams(params, data.filters);
        }

        return params;
    }

    public static buildFilters<T extends Record<string, any>>(filters: T): HttpParams {
        let params = new HttpParams();
        params = this.appendObjectToParams(params, filters);
        return params;
    }

    private static appendObjectToParams(params: HttpParams, obj: Record<string, any>): HttpParams {
        let currentParams = params;

        Object.entries(obj).forEach(([key, value]) => {
            if (this.isValidValue(value)) {
                currentParams = currentParams.append(key, value.toString());
            }
        });

        return currentParams;
    }

    private static isValidValue(value: any): boolean {
        return value !== null && value !== undefined && value !== '';
    }
}