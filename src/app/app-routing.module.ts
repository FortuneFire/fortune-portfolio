// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './components/home/home.component';
// import { PortfolioComponent } from './components/portfolio/portfolio.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { SignInComponent } from './components/sign-in/sign-in.component';

// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'portfolio', component: PortfolioComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'sign-in', component: SignInComponent },
//   { path: '**', redirectTo: '', pathMatch: 'full' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}



import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./components/portfolio/portfolio.component').then(m => m.PortfolioComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./components/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
