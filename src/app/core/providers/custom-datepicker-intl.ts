import { Service } from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';

@Service()
export class CustomDatepickerIntl extends MatDatepickerIntl {
  override calendarLabel = 'Calendario';
  override openCalendarLabel = 'Abrir calendario';
  override closeCalendarLabel = 'Cerrar calendario';
  override prevMonthLabel = 'Mes anterior';
  override nextMonthLabel = 'Mes siguiente';
  override prevYearLabel = 'Año anterior';
  override nextYearLabel = 'Año siguiente';
  override prevMultiYearLabel = '24 años anteriores';
  override nextMultiYearLabel = '24 años siguientes';
  override switchToMonthViewLabel = 'Cambiar a vista de mes';
  override switchToMultiYearViewLabel = 'Elegir mes y año';
}