export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    // 🚀 FIX: Aseguramos que JS lo interprete como UTC agregando la 'Z' si no la tiene
    const safeDateString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const date = new Date(safeDateString);
    
    if (isNaN(date.getTime())) return '-';

    // Formato nativo: dd/MM/yyyy HH:mm
    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date).replace(',', '');
}