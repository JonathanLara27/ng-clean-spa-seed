import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { DestroyRef } from '@angular/core'; // 🔥 Nuevo import
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class FormUtilsHelper {
    /** * 1. Tu joya recursiva para forzar validaciones antes del Submit 
     */
    static forceFormValidation(control: AbstractControl): void {
        if (control instanceof FormGroup || control instanceof FormArray) {
            Object.values(control.controls).forEach(childControl => {
                this.forceFormValidation(childControl);
            });
        } else {
            control.markAsTouched();
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true, emitEvent: true });
        }
    }

    /** * 2. Toggle dinámico de obligatoriedad (Checkbox -> Input)
     */
    static toggleRequired(condition: boolean | null, targetControl: AbstractControl): void {
        if (condition) {
            targetControl.setValidators([Validators.required]);
        } else {
            targetControl.clearValidators();
            targetControl.setValue(null);
        }
        targetControl.updateValueAndValidity();
    }

    /** * 3. Limpiador profundo (Ideal para cuando el usuario cambia de "Tipo de documento")
     * Limpia el valor, quita errores y resetea el estado touched/dirty.
     */
    static resetControl(control: AbstractControl): void {
        control.setValue(null);
        control.clearValidators();
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity();
    }

    static bindConditionalValidation(
        sourceControl: AbstractControl,
        targetControl: AbstractControl,
        destroyRef: DestroyRef // 🔥 Ahora exigimos la referencia de destrucción
    ): void {
        this.toggleRequired(sourceControl.value, targetControl);

        sourceControl.valueChanges
            .pipe(takeUntilDestroyed(destroyRef)) // 🔥 El escudo protector
            .subscribe(val => this.toggleRequired(val, targetControl));
    }
}