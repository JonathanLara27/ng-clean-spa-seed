const normalizeDateString = (dateString: string): string => {
    const safeDate = dateString.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(safeDate)) {
        return `${safeDate}T00:00:00`;
    }

    const timestamp = safeDate.replace(' ', 'T'); // Fix Safari compatibility
    const hasTimezone = /(Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);

    return hasTimezone ? timestamp : `${timestamp}Z`;
};

export function formatDate(dateString: string | null | undefined, withHour: boolean = true): string {
    if (!dateString || dateString === '-') return '-';

    const date = new Date(normalizeDateString(dateString));
    if (isNaN(date.getTime())) return '-';

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit', month: '2-digit', year: 'numeric',
        ...(withHour && { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    return new Intl.DateTimeFormat('es-PE', options).format(date).replace(',', '');
}

export function formatDateIsoString(dateString: string | null | undefined, withHour: boolean = true): string {
    if (!dateString || dateString === '-') return '-';

    const date = new Date(normalizeDateString(dateString));
    if (isNaN(date.getTime())) return '-';

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        ...(withHour && { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    };

    return new Intl.DateTimeFormat('sv-SE', options).format(date);
}

export function toLocalIsoString(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '-';

    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = (num: number) => num.toString().padStart(2, '0');

    const YYYY = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const DD = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    const tzH = pad(Math.floor(Math.abs(tzo) / 60));
    const tzM = pad(Math.abs(tzo) % 60);

    // Template literals limpios en lugar de múltiple concatenación con '+'
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}${dif}${tzH}:${tzM}`;
}

export function parseStringToDate(dateString: string | null | undefined): Date | null {
    if (!dateString || dateString === '-') return null;

    const safeString = dateString.trim();

    // Early return para Formato Frontend: "DD/MM/YYYY"
    if (safeString.includes('/')) {
        const [datePart] = safeString.split(' ');
        const [day, month, year] = datePart.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    // Reutilizamos el helper privado para el formato Backend
    const date = new Date(normalizeDateString(safeString));
    return isNaN(date.getTime()) ? null : date;
}