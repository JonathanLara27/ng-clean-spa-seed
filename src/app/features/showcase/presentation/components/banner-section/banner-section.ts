import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BannerComponent, DraftBannerConfig } from '../../../../../shared/components/banner/banner.component';

@Component({
  selector: 'app-banner-section',
  imports: [
    CommonModule,
    BannerComponent,
  ],
  templateUrl: './banner-section.html',
})
export class BannerSection {
  eliminarBorrador() {
    console.log('Borrador eliminado');
  }

  restaurarBorrador() {
    console.log('Borrador recuperado');
  }

  public banners: DraftBannerConfig[] = [
    //success
    {
      type: 'success',
      title: 'Operación exitosa',
      message: 'Los datos se han guardado correctamente.',
      icon: 'check_circle',
      showActions: false,
    },
    //info
    {
      type: 'info',
      title: 'Información',
      message: 'Los datos se han guardado correctamente.',
      icon: 'info',
      showActions: false,
    },
    //warning
    {
      type: 'warning',
      title: 'Advertencia',
      message: 'Se necesita confirmacion para que puedas continuar',
      icon: 'warning',
      showActions: true,
      secondayTextButton: 'Descartar',
      primaryTextButton: 'Confirmar',
    },
    //error
    {
      type: 'error',
      title: 'Error',
      message: 'Ocurrio un error al guardar el formulario. Desea intentar guardarlo nuevamente?.',
      icon: 'error',
      showActions: true,
      secondayTextButton: 'Cancelar',
      primaryTextButton: 'Reintentar',
    },
    //neutral
    {
      type: 'neutral',
      title: 'Neutral',
      message: 'Los datos se han guardado correctamente.',
      icon: 'help_outline',
      // showActions: true,
      // discardText: 'Descartar',
      // recoverText: 'Recuperar',
    },
  ]
}
