import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const APP_ROUTES: Routes = [
    // Rutas públicas (Sin Sidebar)
    {
        path: 'login',
        loadComponent: () => import('./features/auth/presentation/pages/login/login')
    },

    // Rutas privadas (Envueltas en el MainLayout)
    {
        path: 'ui-kits-docs',
        component: MainLayout, // Este componente renderiza el <app-sidebar>
        loadChildren: () => import('./features/showcase/showcase.routes').then(m => m.SHOW_CASE_ROUTES)
        // canActivate: [authGuard],
        // children: [
        //     {
        //         path: 'campanas',
        //         loadChildren: () => import('./features/campanas/campanas.routes').then(m => m.CampanasRoutes)
        //     },
        //     {
        //         path: 'usuarios',
        //         loadChildren: () => import('./features/usuarios/usuarios.routes').then(m => m.UsuariosRoutes)
        //     },
        //     // Ruta por defecto si está logueado
        //     { path: '', redirectTo: 'campanas', pathMatch: 'full' }
        // ]
    },

    // Catch all
    { path: '**', redirectTo: 'ui-kits-docs' }
];
