import { Injectable } from '@angular/core';
import { MimeType } from '../../core/enums/mime-types.enum';

@Injectable({
    providedIn: 'root'
})
export class FileDownloadHelper {

    /**
     * Descarga un archivo en el navegador usando la API nativa URL.createObjectURL.
     * @param content El contenido del archivo (Blob, ArrayBuffer, texto, etc.)
     * @param fileName El nombre con el que se guardará el archivo (incluyendo extensión)
     * @param mimeType El tipo MIME del archivo usando el enum MimeType
     */
    downloadFile(content: BlobPart, fileName: string, mimeType: MimeType): void {
        const blob = new Blob([content], { type: mimeType });
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
    }
}