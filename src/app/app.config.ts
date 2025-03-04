import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeadStatusComponent } from './components/lead-status/lead-status.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'lead-status', component: LeadStatusComponent, canActivate: [AuthGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(FormsModule)
  ]
};
