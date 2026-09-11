import { Service, signal } from '@angular/core';
import { MenuItem } from '../interfaces/menu.interface';

@Service()
export class UserStore {
    // Estado reactivo simulado
    public readonly menuItems = signal<MenuItem[]>([
        {
            id: '1',
            label: 'UI Kits Documentation',
            icon: 'widgets',
            children: [
                { id: '1-1', label: 'Components', route: '/ui-kits-docs/components', icon: 'star' },
                { id: '1-2', label: 'Services', route: '/ui-kits-docs/services', icon: 'miscellaneous_services' },
                { id: '1-3', label: 'Forms', route: '/ui-kits-docs/forms', icon: 'description' }
            ]
        },
    ]);

    public logout(): void {
        console.log('Cerrando sesión y limpiando estado...');
        // Lógica de limpieza y redirección
    }
}