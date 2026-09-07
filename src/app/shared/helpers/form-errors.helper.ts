import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

/**
 * 1. TRADUCTOR BASE (DRY)
 * Retorna la condición del error en minúsculas para poder concatenarla.
 */
export function getErrorCondition(errorKey: string, errorValue: any): string {
    switch (errorKey) {
        case 'required': return 'es obligatorio';
        case 'requireMatch': return 'debe ser una opción válida de la lista';
        case 'email': return 'tiene un formato de correo inválido';
        case 'pattern': return 'tiene un formato incorrecto';
        case 'minlength': return `debe tener al menos ${errorValue.requiredLength} caracteres`;
        case 'maxlength': return `no puede superar los ${errorValue.requiredLength} caracteres`;
        case 'min': return `debe ser mayor o igual a ${errorValue.min}`;
        case 'max': return `debe ser menor o igual a ${errorValue.max}`;
        case 'uppercaseOnly': return 'solo permite letras mayúsculas';
        default: return 'contiene un error';
    }
}

/**
 * 2. RECOLECTOR RECURSIVO (Para el Snackbar)
 */
export function getFormValidationErrors(
    form: AbstractControl,
    dictionary: Record<string, string>,
    maxErrors: number = 10
): string[] {
    const errors: string[] = [];

    function traverse(control: AbstractControl, controlName: string, arrayPrefix: string = '') {
        if (errors.length >= maxErrors) return;

        if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach((key) => {
                traverse(control.controls[key], key, arrayPrefix);
            });
        } else if (control instanceof FormArray) {
            control.controls.forEach((childCtrl, index) => {
                const newPrefix = ` (Fila ${index + 1})`;
                if (childCtrl instanceof FormGroup) {
                    Object.keys(childCtrl.controls).forEach((key) => {
                        traverse(childCtrl.controls[key], key, newPrefix);
                    });
                } else {
                    traverse(childCtrl, controlName, newPrefix);
                }
            });
        } else {
            if (control.invalid && control.errors) {
                const readableName = dictionary[controlName] || controlName;
                const firstErrorKey = Object.keys(control.errors)[0];
                const errorValue = control.errors[firstErrorKey];

                // 🔥 Usamos la función pura compartida
                const condition = getErrorCondition(firstErrorKey, errorValue);

                errors.push(`El campo "${readableName}"${arrayPrefix} ${condition}.`);
            }
        }
    }

    traverse(form, 'Formulario');
    return errors;
}