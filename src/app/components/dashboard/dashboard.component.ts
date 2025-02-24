import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { UserPerformanceService } from '../../services/userperformance.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ✅ Import AuthService for logout
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  managers: any[] = []; // Stores Manager Performance Data

  constructor(
    private userPerformanceService: UserPerformanceService,
    private authService: AuthService,
    private router: Router // ✅ Inject AuthService
  ) { }

  // ✅ Logout function triggered when user clicks "Sign Out"
  logout(): void {
    this.authService.logout();
  }

  // On component initialization, fetch manager performance data
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // ✅ Redirect to login if not logged in
    } else {
      this.loadManagerPerformance();
    }
  }

  // Fetch manager performance data from API
  loadManagerPerformance(): void {
    this.userPerformanceService.getManagerPerformance().subscribe({
      next: (data) => {
        this.managers = data;
      },
      error: (err) => {
        console.error('Error fetching manager performance:', err);
      }
    });
  }

  // Initialize charts after view is rendered
  ngAfterViewInit(): void {
    this.renderCharts();
  }

  // Render bar chart for lead status
  renderCharts(): void {
    new Chart('bar-chart', {
      type: 'bar',
      data: {
        labels: ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'],
        datasets: [{
          label: 'Lead Status',
          data: [120, 200, 300, 375, 100], // Sample Data
          backgroundColor: ['#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f4a261']
        }]
      }
    });
  }
}
