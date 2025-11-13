import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Graph } from './graph/graph';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'graph', component: Graph }
];
