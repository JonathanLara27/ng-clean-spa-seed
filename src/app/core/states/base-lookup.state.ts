import { signal } from '@angular/core';
import { Subject, EMPTY, Observable } from 'rxjs';
import { exhaustMap, retry, tap, catchError } from 'rxjs/operators';

export abstract class BaseLookupState<T> {

    // 1. Estado centralizado y genérico
    private readonly _data = signal<T[]>([]);
    public readonly data = this._data.asReadonly();
    
    private readonly _isLoading = signal<boolean>(false);
    public readonly isLoading = this._isLoading.asReadonly();


    private readonly loadTrigger$ = new Subject<void>();

    constructor() {
        this.initReactiveFlow();
    }

    /**
     * Contrato obligatorio: El hijo DEBE decirle al padre cómo obtener los datos.
     */
    protected abstract fetchRequest(): Observable<T[]>;

    /**
     * Contrato obligatorio: El hijo DEBE manejar su propio mensaje de error.
     */
    protected abstract handleError(error: any): void;

    /**
     * Motor reactivo cerrado a modificaciones (Clean Code).
     */
    private initReactiveFlow(): void {
        this.loadTrigger$.pipe(
            exhaustMap(() => {
                this._isLoading.set(true);

                return this.fetchRequest().pipe(
                    retry(2),
                    tap({
                        next: (res) => this._data.set(res),
                        finalize: () => this._isLoading.set(false)
                    }),
                    catchError((error) => {
                        this.handleError(error);
                        return EMPTY; // Mantenemos vivo el Subject
                    })
                );
            })
        ).subscribe();
    }

    /**
     * Método público expuesto a los componentes visuales.
     */
    public loadLookupCache(): void {
        if (this._data().length > 0 || this._isLoading() ) return;
        this.loadTrigger$.next();
    }

    public clearCache(): void {
        this._data.set([]);
    }
}