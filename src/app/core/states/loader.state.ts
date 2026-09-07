import { Service, signal } from '@angular/core';

@Service()
export class LoaderState {
    private _isLoading = signal<boolean>(false);

    public isLoading = this._isLoading.asReadonly();

    public setLoading(loading: boolean): void {
        this._isLoading.set(loading);
    }
}
