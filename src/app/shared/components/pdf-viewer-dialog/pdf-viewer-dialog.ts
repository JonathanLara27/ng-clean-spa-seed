import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerDialogData } from './pdf-viewer-dialog.interface';

@Component({
  selector: 'app-pdf-viewer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './pdf-viewer-dialog.html',
  styleUrl: './pdf-viewer-dialog.scss',
})
export class PdfViewerDialog { 

  private sanitizer = inject(DomSanitizer);
  private dialogRef = inject(MatDialogRef<PdfViewerDialog>);

  // Recibimos los datos del componente padre
  public data = inject<PdfViewerDialogData>(MAT_DIALOG_DATA);

  // Variable para almacenar la URL sanitizada
  public safePdfUrl: SafeResourceUrl;

  constructor() {
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdfUrl);
  }

  // Método para cerrar el diálogo
  cerrar(): void {
    this.dialogRef.close();
  }

}
