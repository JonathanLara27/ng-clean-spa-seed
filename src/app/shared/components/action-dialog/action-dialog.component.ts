import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { URL_SVGS } from '../../constants/assetsUrl';
import { FormError } from '../form-error/form-error';
import { FormLabel } from '../form-label/form-label';
import { ActionDialogData } from './action-dialog.interface';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    FormLabel,
    FormError
  ],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.scss',
})
export class ActionDialogComponent {

  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ActionDialogComponent>);

  public data: ActionDialogData = inject(MAT_DIALOG_DATA);

  public url_base = URL_SVGS;

  public formGroup: FormGroup<{ motivo: FormControl<string | null> }> = this.fb.group({
    motivo: this.fb.control<string | null>(null, this.data.isRequired ? [Validators.required, Validators.minLength(10)] : [])
  });

  onSubmit(): void {
    if (!this.data.showTextArea) return this.dialogRef.close(true);

    if (this.formGroup.invalid) return this.formGroup.markAsTouched();
    const motivoValue = this.formGroup.get('motivo')?.value;
    this.dialogRef.close(motivoValue ? motivoValue.trim() : null);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
