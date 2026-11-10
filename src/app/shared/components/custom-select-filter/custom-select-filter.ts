import { Component, input, output, computed, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

export interface CustomSelectFilterOption {
    key: string | number | boolean | null;
    label: string;
}

// 🛡️ Tipado estricto que reemplaza el uso de 'any'
export type SelectFilterValue = string | number | boolean | null | string[] | number[] | boolean[];

@Component({
    selector: 'app-custom-select-filter',
    standalone: true,
    imports: [
        NgClass,
        MatSelectModule
    ],
    template: `
        <mat-select
            class="form-control blue-light"
            [ngClass]="inputClass()"
            
            [value]="value()"
            (selectionChange)="onSelectionChange($event)"
            
            [multiple]="multiple()"
            
            [placeholder]="displayPlaceholder()"
            [disabled]="isDisabled()"
            
            panelClass="rs-custom-select-panel"
            [hideSingleSelectionIndicator]="true">
            
            @for (option of options(); track $index) {
                <mat-option [value]="option.key">
                    {{ option.label }}
                </mat-option>
            }
        </mat-select>
    `,
    styles: [`
        @use 'styles/vendors/select-material';
        :host { display: block; width: 100%; }
        .form-control { display: flex; align-items: center; background-image: none !important; }
        .mat-mdc-select-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; height: 100%; }
        .mat-mdc-select-value { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    `],
    encapsulation: ViewEncapsulation.None
})
export class CustomSelectFilter {
    // ==========================================
    // 📊 DATA Y ESTADO (Inmutable)
    // ==========================================
    public options = input.required<CustomSelectFilterOption[]>();

    // 🔥 Soporta tanto valores primitivos como arrays de primitivos
    public value = input<SelectFilterValue>(null);
    public multiple = input<boolean>(false);

    public isLoading = input<boolean>(false);
    public disabled = input<boolean>(false);

    // ==========================================
    // 🎨 UI
    // ==========================================
    public inputClass = input<string>('');
    public placeholder = input<string>('Filtrar...');

    // ==========================================
    // 🧠 LÓGICA COMPUTADA
    // ==========================================
    public isDisabled = computed(() => this.isLoading() || this.disabled());
    public displayPlaceholder = computed(() => this.isLoading() ? 'Cargando...' : this.placeholder());

    // ==========================================
    // 🎛️ EVENTOS (Delegación)
    // ==========================================

    // El output emite el mismo tipo estricto
    public selectionChange = output<SelectFilterValue>();

    public onSelectionChange(event: MatSelectChange): void {
        if (!event) return;
        this.selectionChange.emit(event.value);
    }
}