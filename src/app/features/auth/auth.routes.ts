import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    // component: TuComponentePrincipal,
    children: [
      // { path: 'nueva-ruta', component: TuOtroComponente }
    ]
  }
];
