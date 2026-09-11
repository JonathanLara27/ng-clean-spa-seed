import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  // Inyección de dependencias (Principio de Inversión de Dependencias)
  private readonly breadcrumbService = inject(BreadcrumbService);

  // Señales expuestas a la vista delegadas al servicio
  public readonly breadcrumbPath = this.breadcrumbService.path;
  public readonly currentRouteName = this.breadcrumbService.currentRoute;

  // Estos datos luego podrán venir de un UserService o AuthStore
  public readonly userName = signal('Sra. Pilar');
  public readonly userRole = signal('Bienvenido');
}
