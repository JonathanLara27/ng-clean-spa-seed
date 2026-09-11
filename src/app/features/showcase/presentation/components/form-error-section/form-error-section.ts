import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import { FormFieldError } from '../../../../../shared/components/form-field-error/form-field-error';
import { FormFieldLabel } from '../../../../../shared/components/form-field-label/form-field-label';
import { FormErrorSectionService } from './form-error-section.service';

@Component({
  selector: 'app-form-error-section',
  imports: [
    CommonModule,
    FormsModule,
    FormField,
    
    FormFieldError,
    FormFieldLabel,
  ],
  providers: [
    FormErrorSectionService,
  ],
  templateUrl: './form-error-section.html',
})
export class FormErrorSection {
  private readonly viewService = inject(FormErrorSectionService);
  public readonly form = this.viewService.form;
  public onSubmit = (event: Event) => this.viewService.onSubmit(event);
}
