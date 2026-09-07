import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [
    RouterOutlet,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ng-clean-spa-seed');
  // private dialog = inject(MatDialog);

  // constructor() {
  //   this.showModalConfirmation('¿Estás seguro de que quieres continuar?');
  // }

  // private async showModalConfirmation(title: string) {
  //   const dialogRef = this.dialog.open(ActionDialogComponent, {
  //     width: '450px',
  //     panelClass: 'custom-dialog-surface',
  //     data: {
  //       ...APP_DIALOGS.confirmacionGeneral, // 1. Cargamos la plantilla base
  //       title: title // 2. Sobreescribimos el título
  //     }
  //   });
  //   return await firstValueFrom(dialogRef.afterClosed()) as boolean;
  // }

  // public onPageChange(page: number): void {
  // }

  // public onPageSizeChange(limit: number): void {
  // }

  // public onAction(event: ActionEvent<any>): void {
  // }
}
