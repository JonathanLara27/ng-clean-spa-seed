import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormUtilsHelper } from './form.utils.helper';
import { NotificationService } from '../../core/services/notification.service';
import { getFormValidationErrors } from './form-errors.helper';

@Injectable({ providedIn: 'root' })
export class FormUiHelperService {
    private notifyService = inject(NotificationService);

    public notifyErrors(form: FormGroup, dictionary: Record<string, string>, title: string = 'Errores en el formulario'): void {
        FormUtilsHelper.forceFormValidation(form);
        const errorMessages = getFormValidationErrors(form, dictionary, 10);
        this.notifyService.error(errorMessages, 'Cerrar', 10000, title);
    }
}