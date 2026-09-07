import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-draft-banner',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './draft-banner.component.html',
  styleUrl: './draft-banner.component.scss',
})
export class DraftBannerComponent {

  public message = input.required<string>();

  // Opcionales por si en otra pantalla quieres cambiar el texto de los botones
  public discardText = input<string>('Descartar');
  public recoverText = input<string>('Recuperar datos');

  // 🚀 Outputs (Eventos)
  public onDiscard = output<void>();
  public onRecover = output<void>();

}
