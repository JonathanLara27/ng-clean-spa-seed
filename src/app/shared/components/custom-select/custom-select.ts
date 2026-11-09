import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormField } from '@angular/forms/signals';
import { InputStatusDirective } from '../../../core/directives/input-status.directive';

export interface CustomSelectOption {
  key: string | number | boolean;
  label: string;
}

@Component({
  selector: 'app-custom-select',
  imports: [
    FormField,
    NgClass,
    MatSelectModule,
    InputStatusDirective
  ],
  template: `
    <!-- 
      🔥 Aplicamos tu clase .form-control directamente.
      El panelClass nos permite estilizar la caja flotante en el SCSS global 
    -->
    <mat-select
        class="form-control"
        [ngClass]="inputClass()"
        [formField]="field()"
        [form]="formGroup()"
        [field]="fieldName()"
        [multiple]="multiple()"
        [placeholder]="placeholder()"
        panelClass="rs-custom-select-panel"
        [hideSingleSelectionIndicator]="true"
        (selectionChange)="onSelectionChange($event)">
        
        @for (option of options(); track option.key) {
            <mat-option [value]="option.key">
                {{ option.label }}
            </mat-option>
        }
    </mat-select>
  `,
  styles: [`
    /* 🛠️ Ajustes locales para que mat-select calce perfecto en tu .form-control */
    :host {
      display: block;
      width: 100%;
    }
    
    .form-control {
      display: flex;
      align-items: center;
      /* Eliminamos el background-image del SVG nativo porque Material trae su propia flecha */
      background-image: none !important; 
    }
    
    /* Centrado del texto interno del select de Material */
    .mat-mdc-select-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    .mat-mdc-select-value {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class CustomSelect {
  // Integración con Form Signals
  public field = input.required<any>();
  public formGroup = input.required<any>();
  public fieldName = input.required<string>();

  // Data y Configuración
  public options = input.required<CustomSelectOption[] | null | undefined>();
  public multiple = input<boolean>(false);

  // UI
  public inputClass = input<string>('');
  public placeholder = input<string>('Seleccionar');

  public selectionChange = output<CustomSelectOption['key']>(); // Puedes tiparlo más fuerte si lo deseas

  public onSelectionChange(event: MatSelectChange): void {
    this.selectionChange.emit(event.value);
  }
}
