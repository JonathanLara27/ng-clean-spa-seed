import { InjectionToken } from "@angular/core";
import { IndexedDbConfig } from "../interfaces/indexed-db.interface";

export const INDEXED_DB_CONFIG = new InjectionToken<IndexedDbConfig>('INDEXED_DB_CONFIG');
// Ejemplo de para qué servía:
// providers: [
//     {
//         provide: INDEXED_DB_CONFIG,
//         useValue: { dbName: 'MiAppDB', storeName: 'Drafts', version: 1 }
//     }
// ]