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
  managers: any[] = [];
  userName: string = '';
  userRole: string = '';

  totalLeads: number = 0;
  newLeads: number = 0;
  contactedLeads: number = 0;
  followUpLeads: number = 0;
  convertedLeads: number = 0;
  lostLeads: number = 0;

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
      if (this.userRole !== 'Sales') {
        this.loadDashboardMetrics();
        this.loadManagerPerformance();
      }
    }
  }

  loadUserData(): void {
    this.userName = this.authService.getUserName() || 'User';
    this.userRole = this.authService.getUserRole() || 'Role';
  }

  loadDashboardMetrics(): void {
    this.leadService.getLeads().subscribe({
      next: (data: any) => {
        const leadCount = data.leadCount;
        this.newLeads = leadCount.new;
        this.contactedLeads = leadCount.contacted;
        this.followUpLeads = leadCount.followUp;
        this.convertedLeads = leadCount.converted;
        this.lostLeads = leadCount.lost;
        this.totalLeads = this.newLeads + this.contactedLeads + this.followUpLeads + this.convertedLeads + this.lostLeads;

        this.barChartData = {
          labels: ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'],
          datasets: [{
            label: 'Lead Status',
            data: [this.newLeads, this.contactedLeads, this.followUpLeads, this.convertedLeads, this.lostLeads],
            backgroundColor: ['#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f4a261']
          }]
        };

        this.renderCharts();
      },
      error: (err) => {
        console.error('Error fetching dashboard metrics:', err);
      }
    });
  }

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

  ngAfterViewInit(): void { }

  renderCharts(): void {
    if (this.userRole !== 'Sales') {
      new Chart('bar-chart', {
        type: 'bar',
        data: this.barChartData
      });
    }
  }
}
