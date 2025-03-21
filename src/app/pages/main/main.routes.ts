import { Routes } from '@angular/router';
import ArtistListComponent from './containers/artist-list/artist-list.component';

const mainRoutes: Routes = [
  { path: '', loadComponent: () => ArtistListComponent },
];

export default mainRoutes;
