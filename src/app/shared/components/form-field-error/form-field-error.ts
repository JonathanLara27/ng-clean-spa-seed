import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  template: `
    @if (isInvalidAndTouched()) {
      <div class="error-container">
        @for (error of errorsList(); track $index) {
          <span class="error-text">{{ error.message }}</span>
        }
      </div>
    }
  `,
  styles: `
    .error-container {
      display: flex;
      flex-direction: column;
      margin-top: 4px; 
      padding-left: 16px;
    }

    .error-text {
      color: var(--rs-error-color, #ef4444); 
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.2;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-3px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
})
export class FormFieldError {

  public readonly form = input.required<any>();
  public readonly field = input.required<string>();

  private control = computed(() => {
    const f = this.form();
    const name = this.field();
    return f ? f[name] : null;
  });

  // 🛠️ Función mágica: Si es un Signal lo ejecuta, si es un valor plano lo devuelve intacto.
  private unwrap(value: any): any {
    return typeof value === 'function' ? value() : value;
  }

  public readonly isInvalidAndTouched = computed(() => {
    const ctrl = this.control();
    if (!ctrl) return false;

    try {
      // 1. Desenvolvemos el control (por si f[name] es un Signal)
      const state = this.unwrap(ctrl);

      // 2. Desenvolvemos las propiedades (por si state.invalid es un Signal)
      const isInvalid = this.unwrap(state?.invalid);
      const isTouched = this.unwrap(state?.touched);

      return Boolean(isInvalid && isTouched);
    } catch (e) {
      return false;
    }
  });

  public readonly errorsList = computed(() => {
    const ctrl = this.control();
    if (!ctrl) return [];

    try {
      const state = this.unwrap(ctrl);
      const errs = this.unwrap(state?.errors);

      if (!errs) return [];

      return Object.values(errs).map((e: any) => {
        // 🔥 FIX: Si la librería devuelve directamente el texto de tu Schema, lo usamos.
        if (typeof e === 'string') {
          return { message: e };
        }
        // Si devuelve un objeto clásico, buscamos la propiedad message.
        return { message: e?.message || 'Campo no válido' };
      });
    } catch (e) {
      return [];
    }
  });
}