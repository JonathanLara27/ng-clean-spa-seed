export enum MimeType {
    // Documentos comunes
    PDF = 'application/pdf',
    EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    CSV = 'text/csv',
    WORD = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    TEXT = 'text/plain',

    // Imágenes
    PNG = 'image/png',
    JPEG = 'image/jpeg',

    // Otros
    ZIP = 'application/zip',
    JSON = 'application/json'
}