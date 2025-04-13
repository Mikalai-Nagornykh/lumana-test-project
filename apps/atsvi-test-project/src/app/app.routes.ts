import { Routes } from '@angular/router';
import artistsRoutes from './pages/artists/artists.routes';
import { DashboardsComponent } from './pages/dashboards/containers/dashboards/dashboards.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => artistsRoutes,
      },
      {
        path: 'dashboards',
        loadComponent: () => DashboardsComponent,
      },
    ],
  },
];
