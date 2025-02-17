import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeadManagementComponent } from './components/lead-management/lead-management.component';
import { LeadStatusComponent } from './components/lead-status/lead-status.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lead-management', component: LeadManagementComponent },
  { path: 'lead-status', component: LeadStatusComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), RouterModule]
};
