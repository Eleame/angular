import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'details/:id', component: DetailPageComponent },
  { path: '**', redirectTo: '' },
];
