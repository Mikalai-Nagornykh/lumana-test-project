import { Routes } from '@angular/router';
import mainRoutes from './pages/main/main.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full',
  },
  {
    path: 'heroes',
    loadChildren: () => mainRoutes,
  },
];
