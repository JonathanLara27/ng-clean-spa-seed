export interface ActionDialogData {
    iconType?: 'material' | 'svg'; // Para saber si usar <mat-icon> o un <img>
    icon?: string;                 // El nombre del icono o la ruta del SVG
    title: string;                // Texto grande
    subtitle?: string;            // Texto pequeño opcional debajo del título
    cancelText: string;           // Texto del botón izquierdo (outline)
    confirmText: string;          // Texto del botón derecho (solid)
    showCancelButton?: boolean;

    // 🚀 NUEVAS CONFIGURACIONES PARA TEXTAREA
    showTextArea?: boolean;
    inputLabel?: string;
    inputPlaceholder?: string;
    isRequired?: boolean; // Para exigir el motivo obligatoriamente
}