import { Service, signal } from '@angular/core';
import { MenuItem } from '../interfaces/menu.interface';

@Service()
export class UserStore {
    // Estado reactivo simulado
    public readonly menuItems = signal<MenuItem[]>([
        {
            id: '1',
            label: 'Gestión de Clientes',
            icon: 'people', // 🔥 Icono nativo de Material
            children: [
                { id: '1-1', label: 'Nuevo Cliente', route: '/clientes/nuevo', icon: 'person_add' },
                { id: '1-2', label: 'Listado', route: '/clientes/lista', icon: 'list' }
            ]
        },
        {
            id: '2',
            label: 'Gestión de Campañas',
            route: '/campanas',
            icon: 'campaign' // 🔥 Icono nativo de Material
        },
        {
            id: '3',
            label: 'Gestión de Usuarios',
            route: '/usuarios',
            icon: 'manage_accounts' // 🔥 Icono nativo de Material
            // svgIcon: 'tu-icono-personalizado' // Úsalo así si registraste uno en MatIconRegistry
        }
    ]);

    public logout(): void {
        console.log('Cerrando sesión y limpiando estado...');
        // Lógica de limpieza y redirección
    }
}