export interface PageHeaderConfig {
    title: string;
    subtitle?: string;
    actionButton?: {
        text: string;
        icon?: string; // Ej: 'add_circle_outline'
        class?: 'btn-primary' | 'btn-secondary'; // Clase CSS para el botón, por defecto 'btn-primary'
    };
}