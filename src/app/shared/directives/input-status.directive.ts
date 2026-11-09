import { Directive, input, computed } from '@angular/core';

@Directive({
  selector: 'input[form][field], select[form][field], textarea[form][field] mat-select[form][field]',
  standalone: true,
  host: {
    '[class.ng-invalid]': 'isInvalid()',
    '[class.ng-valid]': '!isInvalid()',
    '[class.ng-touched]': 'isTouched()',
    '[class.ng-dirty]': 'isDirty()'
  }
})
export class InputStatusDirective {
  // Recibimos exactamente lo mismo que tu componente de error
  public readonly form = input.required<any>();
  public readonly field = input.required<string>();

  // 🛠️ Extraemos el control igual que en tu form-field-error.ts
  private control = computed(() => {
    const f = this.form();
    const name = this.field();
    return f ? f[name] : null;
  });

  private unwrap(value: any): any {
    return typeof value === 'function' ? value() : value;
  }

  public readonly isInvalid = computed(() => {
    const ctrl = this.control();
    if (!ctrl) return false;
    try {
      const state = this.unwrap(ctrl);
      return Boolean(this.unwrap(state?.invalid));
    } catch (e) {
      return false;
    }
  });

  public readonly isTouched = computed(() => {
    const ctrl = this.control();
    if (!ctrl) return false;
    try {
      const state = this.unwrap(ctrl);
      return Boolean(this.unwrap(state?.touched));
    } catch (e) {
      return false;
    }
  });

  public readonly isDirty = computed(() => {
    const ctrl = this.control();
    if (!ctrl) return false;
    try {
      const state = this.unwrap(ctrl);
      return Boolean(this.unwrap(state?.dirty));
    } catch (e) {
      return false;
    }
  });
}