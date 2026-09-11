import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type BannerType = 'info' | 'warning' | 'error' | 'neutral' | 'success';

export interface DraftBannerConfig {
  type?: BannerType;           // Por defecto será 'info' si no se envía
  title?: string;              // Título opcional
  message: string;             // Mensaje principal (obligatorio)
  icon?: string;               // Nombre del mat-icon (ej. 'info', 'warning', etc.)
  showActions?: boolean;       // Controla si se muestran o no los botones
  secondayTextButton?: string;        // Texto del botón de descartar
  primaryTextButton?: string;        // Texto del botón de recuperar
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './banner.component.html',
})
export class BannerComponent {

  // 🔹 Input único de configuración
  public readonly config = input.required<DraftBannerConfig>();

  // 🚀 Outputs (Eventos de acción)
  public readonly onDiscard = output<void>();
  public readonly onRecover = output<void>();

  // 🧠 Señales derivadas para manejar valores por defecto de forma limpia
  public readonly bannerType = computed<BannerType>(() => this.config().type ?? 'info');
  public readonly hasActions = computed<boolean>(() => this.config().showActions ?? false);

  public readonly discardLabel = computed<string>(() => this.config().secondayTextButton ?? 'Cancelar');
  public readonly recoverLabel = computed<string>(() => this.config().primaryTextButton ?? 'Confirmar');

  // Asigna un ícono de Material por defecto según la variante si no se provee uno
  public readonly bannerIcon = computed<string>(() => {
    const customIcon = this.config().icon;
    if (customIcon) return customIcon;

    switch (this.bannerType()) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      case 'neutral': return 'help_outline';
      default: return 'info';
    }
  });

  public readonly primaryButtonClass = computed<string>(() => {
    const type = this.bannerType();
    return `btn-${type}`;
  });

  public readonly secondaryButtonClass = computed<string>(() => {
    const type = this.bannerType();
    return `btn-outline-${type}`;
  });
}
