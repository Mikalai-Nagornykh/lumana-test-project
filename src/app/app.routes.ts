import { Routes } from '@angular/router';
import mainRoutes from './pages/main/main.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'artists',
    pathMatch: 'full',
  },
  {
    path: 'artists',
    loadChildren: () => mainRoutes,
  },
];
