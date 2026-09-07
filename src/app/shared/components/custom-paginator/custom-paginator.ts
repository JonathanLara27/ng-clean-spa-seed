import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_PAGINATION, PAGE_SIZE_OPTIONS_DEFAULT } from '../../../core/interfaces/pagination.interface';

export const SUMA_PAGINATOR_DEFAULT_TEXTS = {
  of: 'de',
  to: 'al',
  results: 'resultados',
  show: 'Mostrar:',
  first: 'Primera',
  previous: 'Anterior',
  next: 'Siguiente',
  last: 'Última'
};

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './custom-paginator.html',
  styleUrls: ['./custom-paginator.scss']
})
export class CustomPaginatorComponent {
  // 🔥 Inputs Base
  public totalItems = input.required<number>();
  public currentPage = input.required<number>();
  public pageSize = input<number>(DEFAULT_PAGINATION.limit);

  // 💡 NUEVOS: Feature Flags y Opciones (Con valores por defecto para no romper nada existente)
  public showPageSizeOptions = input<boolean>(false);
  public pageSizeOptions = input<number[]>(PAGE_SIZE_OPTIONS_DEFAULT);
  public showFirstLastButtons = input<boolean>(false);

  public texts = input(SUMA_PAGINATOR_DEFAULT_TEXTS);

  // 🔥 Outputs
  public pageChange = output<number>();
  public pageSizeChange = output<number>(); // Avisa cuando cambia el límite

  // 🧮 Lógica computada
  public totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);

  public startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  public endItem = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  });

  public hasPrevPage = computed(() => this.currentPage() > 1);
  public hasNextPage = computed(() => this.currentPage() < this.totalPages());

  // 🚀 Acciones de Navegación
  public onFirst(): void {
    if (this.hasPrevPage()) this.pageChange.emit(1);
  }

  public onPrev(): void {
    if (this.hasPrevPage()) this.pageChange.emit(this.currentPage() - 1);
  }

  public onNext(): void {
    if (this.hasNextPage()) this.pageChange.emit(this.currentPage() + 1);
  }

  public onLast(): void {
    if (this.hasNextPage()) this.pageChange.emit(this.totalPages());
  }

  // 🚀 Acción de cambiar el límite por página
  public onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = Number(target.value);
    this.pageSizeChange.emit(newSize);
  }
}