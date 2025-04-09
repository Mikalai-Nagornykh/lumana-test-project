import { Routes } from '@angular/router';
import ArtistListComponent from './containers/artist-list/artist-list.component';

const artistsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'artists',
    pathMatch: 'full',
  },
  { path: 'artists', loadComponent: () => ArtistListComponent },
];

export default artistsRoutes;
