import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
  // Simulamos los datos que vendrían de tu lógica global
  public breadcrumbPath = signal('Home');
  public currentRouteName = signal('Gestión de Campañas');

  public userName = signal('Sra. Pilar');
  public userRole = signal('Bienvenido');
}
