// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule, Routes } from '@angular/router';
// import { AppRoutingModule } from './app-routing.module';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxFileDropModule } from 'ngx-file-drop';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
// import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';



// import { AppComponent } from './app.component';
// import { HomeComponent } from './components/home/home.component';
// import { PortfolioComponent } from './components/portfolio/portfolio.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { HeaderComponent } from './components/header/header.component';
// import { SignInComponent } from './components/sign-in/sign-in.component';
// import { ProjectFormComponent } from './components/projects/project-form.component';

// const appRoutes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'portfolio', component: PortfolioComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: '**', redirectTo: '' }

// ];

// @NgModule({
//   declarations: [
//     AppComponent,
//     HomeComponent,
//     PortfolioComponent,
//     DashboardComponent,
//     HeaderComponent,
//     SignInComponent,
//     ProjectFormComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     RouterModule.forRoot(appRoutes),
//     FormsModule,
//     ReactiveFormsModule,
//     NgxFileDropModule,
//     BrowserAnimationsModule,
//     MatFormFieldModule,
//     MatInputModule,
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modern Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProjectFormComponent } from './components/projects/project-form.component';

// Routes configuration
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    HomeComponent,
    PortfolioComponent,
    DashboardComponent,
    SignInComponent,
    ProjectFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule { }
