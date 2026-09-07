import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormError } from '../form-error/form-error';
import { FormLabel } from '../form-label/form-label';

export interface GenericUpsertModalConfig {
  title: string;
  inputLabel: string;
  inputPlaceholder?: string;
  inputValue?: string; // Si tiene valor = Editar; Si es nulo = Crear
  useTextArea?: boolean;
  textAreaRows?: number;
  saveButtonText?: string;
  cancelButtonText?: string;
  toUppercase?: boolean;
}

@Component({
  selector: 'app-generic-upsert-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormLabel,
    FormError
  ],
  templateUrl: './generic-upsert-modal.html',
})
export class GenericUpsertModal {

  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<GenericUpsertModal>);

  public config: GenericUpsertModalConfig = inject(MAT_DIALOG_DATA);

  public formGroup = this.fb.group({
    inputValue: this.fb.control<string>(this.config.inputValue || '', {
      validators: [Validators.required, Validators.minLength(3)],
    })
  });

  public onSubmit(): void {
    if (!this.formGroup.valid) return this.formGroup.markAllAsTouched();

    const value = this.formGroup.controls.inputValue.value?.trim();
    this.dialogRef.close(this.config.toUppercase ? value?.toUpperCase() : value);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

}
