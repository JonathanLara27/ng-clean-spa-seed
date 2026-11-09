import { Component, input } from '@angular/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { NgClass } from '@angular/common';
import { CustomDatepickerIntl } from '../../../core/providers/custom-datepicker-intl';
import { FormField } from '@angular/forms/signals';
import { InputStatusDirective } from '../../../core/directives/input-status.directive';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, CUSTOM_DATE_FORMATS } from '../../../core/providers/custom-date-adapter';

@Component({
  selector: 'app-custom-date-picker',
  imports: [
    FormField,
    NgClass,
    MatDatepickerModule,
    InputStatusDirective
  ],
  providers: [
    { provide: MatDatepickerIntl, useClass: CustomDatepickerIntl },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  template: `
        <div class="input-with-icon">
            <input 
                class="form-control has-suffix" 
                [ngClass]="inputClass()"
                [matDatepicker]="picker" 
                [formField]="field()" 
                [form]="formGroup()" 
                [field]="fieldName()"
                [placeholder]="placeholder()" 
                (click)="picker.open()" 
                readonly>

            <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
        </div>
    `,
})
export class CustomDatePicker {
  public field = input.required<any>();

  public formGroup = input.required<any>();
  public fieldName = input.required<string>();

  public inputClass = input<string>('');
  public placeholder = input<string>('DD/MM/YYYY');
}