import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../pages/home/home';
import { DetailComponent } from '../pages/detail/detail.component';

const appRoutes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'detail',
  component: DetailComponent
}, {
  path: 'lazy',
  loadChildren: '../pages/lazy/lazy.module#LazyModule'
}];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
