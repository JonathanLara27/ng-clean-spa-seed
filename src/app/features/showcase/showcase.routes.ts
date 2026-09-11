import { Routes } from '@angular/router';

export const SHOW_CASE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'components',
        loadComponent: () => import('./presentation/pages/components-demo/components-demo')
      },
      {
        path: 'services',
        loadComponent: () => import('./presentation/pages/services-demo/services-demo')
      },
      {
        path: 'forms',
        loadComponent: () => import('./presentation/pages/forms-demo/forms-demo')
      },
      // Catch all
      { path: '**', redirectTo: 'components' }
    ]
  }
];
