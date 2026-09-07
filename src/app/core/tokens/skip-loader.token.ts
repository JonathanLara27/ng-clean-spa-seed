import { HttpContextToken } from '@angular/common/http';

// Por defecto es false, lo que significa que el loader SÍ se muestra normalmente
export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);