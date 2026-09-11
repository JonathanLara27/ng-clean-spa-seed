import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderConfig } from './page-header.interface';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {

  config = input.required<PageHeaderConfig>();

  buttonClass = computed(() => {
    if (!this.config().actionButton) return 'btn-primary';
    return this.config().actionButton?.class || 'btn-primary';
  });

  // Output para el evento de clic del botón
  actionClick = output<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }

}
