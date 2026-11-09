import { computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export abstract class BaseQueryState<T, Params> {
    protected readonly notify = inject(NotificationService);
    protected readonly router = inject(Router);

    // Bandera: true para notificación específica de esta clase, false para delegar al Interceptor Global.
    protected useLocalErrorHandler: boolean = true;

    protected fallbackRouteOnError: any[] | null = null; 

    protected _params = signal<Params | null>(null);

    protected abstract fetchRequest(params: Params): Observable<T | null>;
    protected abstract getEntityName(): string;

    protected resource = rxResource({
        params: () => this._params(),
        stream: ({ params }) => {
            if (!params) return of(null);

            return this.fetchRequest(params).pipe(
                catchError((error: HttpErrorResponse | Error) => {
                    if (this.useLocalErrorHandler) {
                        const errorMsg = error instanceof HttpErrorResponse 
                            ? (error.error?.message || error.message)
                            : error.message || 'Error inesperado';
                            
                        this.notify.error(`No se pudo cargar ${this.getEntityName()}: ${errorMsg}`);
                    }

                    if (this.fallbackRouteOnError) {
                        this.router.navigate(this.fallbackRouteOnError);
                    }

                    return of(null);
                })
            );
        }
    });

    public data = computed<T | null>(() => (this.resource.value() as T) ?? null);
    public isLoading = this.resource.isLoading;
    
    public execute(params: Params): void {
        this._params.set(params);
    }

    public clear(): void {
        this._params.set(null);
    }
    
    public reload(): void {
        this.resource.reload();
    }
}