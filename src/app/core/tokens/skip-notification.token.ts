import { HttpContextToken } from '@angular/common/http';

export const SKIP_NOTIF = new HttpContextToken<boolean>(() => false);