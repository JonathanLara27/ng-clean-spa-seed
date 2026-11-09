import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
    override format(date: Date, displayFormat: Object): string {
        if (displayFormat != 'input') return super.format(date, displayFormat);

        // Forzamos los 2 dígitos con padStart
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

export const CUSTOM_DATE_FORMATS = {
    parse: {
        dateInput: 'input',
    },
    display: {
        dateInput: 'input',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};