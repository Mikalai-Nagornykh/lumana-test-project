import { Routes } from '@angular/router';
import artistsRoutes from './pages/artists/artists.routes';
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
    ],
  },
];
