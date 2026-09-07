import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, Validators } from '@angular/forms';
import { merge } from 'rxjs';

@Component({
  selector: 'app-form-label',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <label class="form-label">
      {{ text() }}
      @if (isRequired()) {
        <span class="required">*</span>
      }
  </label>
  `,
  styles: `
  :host {
    display: block;
    margin-bottom: 8px;
  }
  .form-label {
      font-size: 16px;
      font-weight: 700;
      color: var(--rs-title-color);
      margin-bottom: 8px;

      .required {
          color: var(--rs-error-color);
          margin-left: 4px;
      }
  }
  `,
})
export class FormLabel {

  text = input.required<string>();

  control = input<AbstractControl | null>(null);

  private _isRequired = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  public isRequired = this._isRequired.asReadonly();

  ngOnInit(): void {
    this.evaluateRequired();
  }

  private evaluateRequired(): void {
    const ctrl = this.control();
    if (!ctrl) return;

    this.checkValidators(ctrl);

    merge(
      ctrl.statusChanges,
      ctrl.valueChanges,
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      const hasRequired = ctrl.hasValidator(Validators.required) || ctrl.hasValidator(Validators.requiredTrue);
      this._isRequired.set(hasRequired);
    });
  }

  private checkValidators(ctrl: AbstractControl): void {
    const hasRequired = ctrl.hasValidator(Validators.required) || ctrl.hasValidator(Validators.requiredTrue);
    this._isRequired.set(hasRequired);
  }
}
