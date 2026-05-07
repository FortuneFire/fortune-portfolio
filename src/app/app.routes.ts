// import { Routes } from '@angular/router';
// import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
// import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

// import { HomeComponent } from './components/home/home.component';
import { About } from './components/about/about';
// import { PortfolioComponent } from './components/portfolio/portfolio.component';
// import { SignInComponent } from './components/sign-in/sign-in.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';

// export const appRoutes: Routes = [

//   /* Public Pages */
//   {
//     path: '',
//     component: PublicLayoutComponent,
//     children: [
//       { path: '', component: HomeComponent },
//       { path: 'portfolio', component: PortfolioComponent },
//       { path: 'sign-in', component: SignInComponent }
//     ]
//   },

//   /* Dashboard Pages (Protected Later With Auth Guard) */
//   {
//     path: 'dashboard',
//     component: DashboardLayoutComponent,
//     children: [
//       { path: '', component: DashboardComponent }
//     ]
//   },

//   /* Catch All */
//   { path: '**', redirectTo: '' }

// ];


import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

import { HomeComponent } from './components/home/home.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectFormComponent } from './components/projects-form/project-form.component';
import { ManageProjectsComponent } from './components/manage-projects/manage-projects';

export const appRoutes: Routes = [

  /* =====================
     PUBLIC ROUTES
  ===================== */

  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: About },
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'sign-in', component: SignInComponent }
    ]
  },

  /* =====================
     DASHBOARD ROUTES
  ===================== */

  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'add', component: ProjectFormComponent },
      { path: 'manage', component: ManageProjectsComponent },
      { path: '**', redirectTo: '' }
    ]
  },

  /* Catch All */
  { path: '**', redirectTo: '' }

];