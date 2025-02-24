import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeadManagementComponent } from './components/lead-management/lead-management.component';
import { LeadStatusComponent } from './components/lead-status/lead-status.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lead-management', component: LeadManagementComponent },
  { path: 'lead-status', component: LeadStatusComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // ✅ Enables Fetch API for HttpClient
  ]
};
