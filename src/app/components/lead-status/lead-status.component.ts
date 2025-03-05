import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { UserService } from '../../services/userservice.service';
import { AuthService } from '../../services/auth.service'; // ✅ Import AuthService
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-status',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lead-status.component.html',
  styleUrl: './lead-status.component.scss'
})
export class LeadStatusComponent implements OnInit {
  leads: any[] = [];
  users: { [key: number]: string } = {};
  userName: string = '';
  userRole: string = ''; // ✅ Store user role

  isModalOpen: boolean = false;
  modalMode: 'add' | 'view' = 'add';
  modalLead: any = {
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New',
    assignedTo: null
  };

  constructor(private leadService: LeadService, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || ''; // ✅ Get user role
    this.userName = this.authService.getUserName() || 'User';
    this.loadUsers();
    this.loadLeads();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      const usersArray = data.$values ?? data;
      const usersDict: { [key: number]: string } = {};
      usersArray.forEach((user: any) => {
        usersDict[user.id] = user.name;
      });
      this.users = usersDict;
    }, error => console.error('Error fetching users:', error));
  }

  loadLeads() {
    this.leadService.getLeads().subscribe({
      next: (data) => {
        if (data && data.leads && data.leads.$values) {
          this.leads = data.leads.$values;
        } else {
          this.leads = [];
        }
      },
      error: (err) => console.error('Error fetching leads:', err)
    });
  }

  getAssignedUserName(userId: number): string {
    return this.users[userId] || 'Unknown';
  }

  openAddModal() {
    this.modalMode = 'add';
    this.modalLead = {
      name: '',
      email: '',
      phone: '',
      source: '',
      status: 'New',
      assignedTo: null
    };
    this.isModalOpen = true;
  }

  openViewModal(lead: any) {
    this.modalMode = 'view';
    this.modalLead = { ...lead };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  saveLead() {
    const payload = {
      name: this.modalLead.name,
      email: this.modalLead.email,
      phone: this.modalLead.phone,
      source: this.modalLead.source,
      status: this.modalLead.status,
      assignedTo: this.modalLead.assignedTo ? Number(this.modalLead.assignedTo) : null
    };

    this.leadService.createLead(payload).subscribe({
      next: () => {
        this.loadLeads();
        this.closeModal();
      },
      error: (err) => console.error('Error creating lead:', err)
    });
  }

  updateLead() {
    const payload = {
      id: this.modalLead.id,
      name: this.modalLead.name,
      email: this.modalLead.email,
      phone: this.modalLead.phone,
      source: this.modalLead.source,
      status: this.modalLead.status,
      assignedTo: this.modalLead.assignedTo ? Number(this.modalLead.assignedTo) : null
    };

    this.leadService.updateLead(payload.id, payload).subscribe({
      next: () => {
        this.loadLeads();
        this.closeModal();
      },
      error: (err) => console.error('Error updating lead:', err)
    });
  }

  deleteLead() {
    if (confirm("Are you sure you want to delete this lead?")) {
      this.leadService.deleteLead(this.modalLead.id).subscribe({
        next: () => {
          this.loadLeads();
          this.closeModal();
        },
        error: (err) => console.error('Error deleting lead:', err)
      });
    }
  }
}

