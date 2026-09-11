export interface Customer {
    id: number;
    fullName: string;
    email: string;
    isActive: 'Activo' | 'Inactivo';
    createdAt: Date;
}

export interface CustomerLookup {
    id: number;
    nombre: string;
}

export interface CustomerWritePayload {
    firstName: string;
    // lastName: string;
    // email: string;
}