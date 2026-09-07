import { CommonModule } from '@angular/common';
import { Component, DoCheck, input, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { getErrorCondition } from '../../helpers/form-errors.helper';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  template: `
    @if (errorMessage()) {
      <div class="form-error-message">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <span class="error-text">{{ errorMessage() }}</span>
      </div>
    }
  `,
  styles: `
    @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .form-error-message {
    // 🔥 Ya no usamos flexbox aquí para no pelear con las cajas fraccionadas
    display: block;
    color: var(--rs-error-color, #cc1d23);
    margin-top: 4px;
    animation: slideDownAndFade 0.2s ease-out forwards;

    .error-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      display: inline-block; // Permite usar vertical-align
      vertical-align: middle; // 🔥 Alineación tipográfica pura
      margin-right: 4px; // El equivalente a nuestro antiguo gap
    }

    .error-text {
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
      vertical-align: middle; // 🔥 Obliga al texto a seguir la misma línea base del icono
      line-height: normal; // Dejamos que el navegador decida
    }
  }
  `,
})
export class FormError implements DoCheck {

  // Recibimos el control del formulario
  control = input.required<AbstractControl | null>();

  // Signal manual que actualizaremos nosotros
  errorMessage = signal<string>('');

  ngDoCheck(): void {
    const ctrl = this.control();
    if(!ctrl) return;
    this.checkErrors(ctrl);
  }

  // La lógica que ya tenías, pero ahora actualiza el signal directamente
  private checkErrors(ctrl: AbstractControl): void {
    if (ctrl.invalid && (ctrl.dirty || ctrl.touched) && ctrl.errors) {
      const firstErrorKey = Object.keys(ctrl.errors)[0];
      const errorValue = ctrl.errors[firstErrorKey];

      // 🔥 Consumimos el helper y le damos formato local
      const condition = getErrorCondition(firstErrorKey, errorValue);
      this.errorMessage.set(`Este campo ${condition}.`);

    } else {
      this.errorMessage.set('');
    }
  }

}
