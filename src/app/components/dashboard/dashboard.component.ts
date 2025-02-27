import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { UserPerformanceService } from '../../services/userperformance.service';
import { LeadService } from '../../services/lead.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Performance data from UserPerformanceController
  managers: any[] = []; // Each object: { Username, LeadsAssigned, LeadsConverted, LastUpdated }
  userName: string = '';
  userRole: string = '';

  // Dashboard metrics (from LeadController's leadCount)
  totalLeads: number = 0;
  newLeads: number = 0;
  contactedLeads: number = 0;
  followUpLeads: number = 0;
  convertedLeads: number = 0;
  lostLeads: number = 0;

  // Chart data object
  barChartData: any = {};

  constructor(
    private userPerformanceService: UserPerformanceService,
    private leadService: LeadService,
    private authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.loadUserData();
      this.loadDashboardMetrics(); // Load lead metrics from backend
      this.loadManagerPerformance(); // Load manager performance table data
    }
  }

  loadUserData(): void {
    this.userName = this.authService.getUserName() || 'User';
    this.userRole = this.authService.getUserRole() || 'Role';
  }

  // Load metrics (lead counts) from the backend
  loadDashboardMetrics(): void {
    this.leadService.getLeads().subscribe({
      next: (data: any) => {
        console.log('Dashboard Metrics:', data);
        // Expecting data.leadCount to have keys: New, Contacted, FollowUp, Converted, Lost
        const leadCount = data.leadCount;
        console.log(leadCount);
        this.newLeads = leadCount.new;
        this.contactedLeads = leadCount.contacted;
        this.followUpLeads = leadCount.followUp;
        this.convertedLeads = leadCount.converted;
        this.lostLeads = leadCount.lost;
        this.totalLeads = this.newLeads + this.contactedLeads + this.followUpLeads + this.convertedLeads + this.lostLeads;

        // Prepare bar chart data using these metrics
        this.barChartData = {
          labels: ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'],
          datasets: [{
            label: 'Lead Status',
            data: [this.newLeads, this.contactedLeads, this.followUpLeads, this.convertedLeads, this.lostLeads],
            backgroundColor: ['#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f4a261']
          }]
        };

        // Render the chart after data is loaded
        this.renderCharts();
      },
      error: (err) => {
        console.error('Error fetching dashboard metrics:', err);
      }
    });
  }

  // Load manager performance data from your UserPerformanceController
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

  // After the view is initialized, chart rendering is triggered when metrics are loaded.
  ngAfterViewInit(): void {
    // Chart rendering is called in loadDashboardMetrics()
  }

  renderCharts(): void {
    new Chart('bar-chart', {
      type: 'bar',
      data: this.barChartData
    });
  }
}
