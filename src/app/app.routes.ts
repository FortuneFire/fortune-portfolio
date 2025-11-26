// src/app/app.routes.ts
// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'portfolio',
    component: PortfolioComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: '**', // wildcard route
    redirectTo: '', // redirect to home
    pathMatch: 'full'
  }
];

