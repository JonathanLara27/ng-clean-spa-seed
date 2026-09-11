import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field-label',
  standalone: true,
  imports: [CommonModule],
  template: `
  <label class="form-label">
      {{ text() }}
      @if (isRequired()) {
        <span class="required" aria-hidden="true">*</span>
      }
  </label>
  `,
  styles: `
  :host {
    display: block;
  }
  .form-label {
      font-size: 16px;
      font-weight: 700;
      color: var(--rs-title-color, #01387b);

      .required {
          color: var(--rs-error-color, #ef4444);
          margin-left: 4px;
      }
  }
  `,
})
export class FormFieldLabel {
  // 1. El texto sigue siendo obligatorio
  public readonly text = input.required<string>();

  // 2. En lugar de un AbstractControl, recibimos directamente el estado reactivo.
  // Si tu librería o lógica de "forms signals" indica que es requerido, se lo pasas aquí.
  public readonly isRequired = input<boolean>(false);
}