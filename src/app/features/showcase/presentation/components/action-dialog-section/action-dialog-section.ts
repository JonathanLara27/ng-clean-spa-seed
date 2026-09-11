import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormFieldError } from '../../../../../shared/components/form-field-error/form-field-error';
import { FormFieldLabel } from '../../../../../shared/components/form-field-label/form-field-label';
import { ActionDialogSectionService } from './action-dialog-section.service';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-action-dialog-section',
  imports: [
    CommonModule,
    FormsModule,
    FormField,

    FormFieldLabel,
    FormFieldError,
  ],
  providers: [
    ActionDialogSectionService
  ],
  templateUrl: './action-dialog-section.html',
})
export class ActionDialogSection {
  private readonly viewService = inject(ActionDialogSectionService);

  public deleteForm = this.viewService.deleteForm;

  public deleteSubmit = (event: Event) => this.viewService.openDeleteAction(event);

  public openConfirmationAction = () => this.viewService.openConfirmationAction();

  public openUnsavedChanges = () => this.viewService.openUnsavedChanges();
}
