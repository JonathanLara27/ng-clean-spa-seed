import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormFieldError } from '../form-field-error/form-field-error';
import { FormFieldLabel } from '../form-field-label/form-field-label';
import { FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-global-search',
  imports: [
    FormsModule,
    FormField,
    CommonModule,
    FormFieldLabel,
    FormFieldError
  ],
  template: `
    <section class="card pb-1"> 
        <form (ngSubmit)="onSearchSubmit($event)" class="global-search__form">
            
            <div class="global-search__input-wrapper">
                <app-form-field-label 
                    [text]="label()" 
                    [isRequired]="isRequired()">
                </app-form-field-label>
                
                <!-- Enlazamos el control dinámicamente evaluando el form y el fieldName -->
                <input 
                    [formField]="form()[fieldName()]" 
                    type="search" 
                    class="form-control" 
                    [placeholder]="placeholder()" />
                
                <div class="global-search__error">
                    <app-form-field-error [form]="form()" [field]="fieldName()" />
                </div>
            </div>

            <div class="global-search__btn-wrapper">
                <button 
                    type="submit" 
                    class="btn btn-secondary" 
                    [disabled]="isSubmitting()">
                    {{ buttonText() }}
                </button>
            </div>

        </form>
    </section>
  `,
  styleUrl: './global-search.scss',
})
export class GlobalSearch {
  // 🎛️ Configuración de Textos (con valores por defecto)
  public readonly label = input.required<string>();
  public readonly placeholder = input.required<string>();
  public readonly buttonText = input<string>('Buscar');

  // 📋 Configuración del Formulario (Obligatorios)
  public readonly form = input.required<any>(); // El signal de tu form completo
  public readonly fieldName = input.required<string>(); // El nombre de la propiedad (ej. 'dni')

  // ⚙️ Estados
  public readonly isRequired = input<boolean>(true);
  public readonly isSubmitting = input<boolean>(false);

  // 🚀 Evento de salida
  public readonly search = output<Event>();

  public onSearchSubmit(event: Event): void {
    this.search.emit(event);
  }
}
