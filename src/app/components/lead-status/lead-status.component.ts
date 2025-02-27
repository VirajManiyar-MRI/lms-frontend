import { Component, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { UserService } from '../../services/userservice.service';
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
  leads: any[] = []; // Array to store leads
  users: { [key: number]: string } = {}; // Lookup table { userId: userName }

  // Modal properties
  isModalOpen: boolean = false;
  modalMode: 'add' | 'view' = 'add'; // 'add' for new lead, 'view' for editing an existing lead
  modalLead: any = {
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New', // Default status for new lead
    assignedTo: null
  };

  constructor(private leadService: LeadService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers(); // Load users first (for "Assigned To" dropdown)
    this.loadLeads(); // Then load leads
  }

  // Fetch users and store them in a lookup object
  loadUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      const usersArray = data.$values ?? data; // Extract array from $values or use raw data
      const usersDict: { [key: number]: string } = {};
      usersArray.forEach((user: any) => {
        usersDict[user.id] = user.name;
      });
      this.users = usersDict;
      console.log("Users Loaded:", this.users);
    }, error => console.error('Error fetching users:', error));
  }

  // Fetch leads and assign them to the component property
  loadLeads() {
    this.leadService.getLeads().subscribe({
      next: (data) => {
        console.log("API Response:", data);
        if (data && data.leads && data.leads.$values) {
          this.leads = data.leads.$values;
        } else {
          this.leads = [];
        }
        console.log("Leads array:", this.leads);
      },
      error: (err) => console.error('Error fetching leads:', err)
    });
  }

  // Helper function to get the assigned user's name based on their ID
  getAssignedUserName(userId: number): string {
    return this.users[userId] || 'Unknown';
  }

  // Open modal in "Add" mode
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

  // Open modal in "View" mode and load the lead data
  openViewModal(lead: any) {
    this.modalMode = 'view';
    // Create a shallow copy to avoid immediate changes to the table until saved
    this.modalLead = { ...lead };
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Save a new lead via the API
  saveLead() {
    // Construct a clean payload for creation (without an id)
    const payload = {
      name: this.modalLead.name,
      email: this.modalLead.email,
      phone: this.modalLead.phone,
      source: this.modalLead.source,
      status: this.modalLead.status,
      assignedTo: this.modalLead.assignedTo ? Number(this.modalLead.assignedTo) : null
    };

    this.leadService.createLead(payload).subscribe({
      next: (res) => {
        console.log("Lead created:", res);
        this.loadLeads(); // Refresh the leads list
        this.closeModal();
      },
      error: (err) => console.error('Error creating lead:', err)
    });
  }

  // Update an existing lead via the API
  updateLead() {
    // Construct a clean payload for update
    const payload = {
      id: this.modalLead.id,  // Ensure the id is included for update
      name: this.modalLead.name,
      email: this.modalLead.email,
      phone: this.modalLead.phone,
      source: this.modalLead.source,
      status: this.modalLead.status,
      // If assignedTo is falsy (e.g., null, empty string), set it to null; otherwise convert to number
      assignedTo: this.modalLead.assignedTo ? Number(this.modalLead.assignedTo) : null
    };

    console.log("Update payload:", payload);

    this.leadService.updateLead(payload.id, payload).subscribe({
      next: (res) => {
        console.log("Lead updated:", res);
        this.loadLeads(); // Refresh the leads list
        this.closeModal();
      },
      error: (err) => console.error('Error updating lead:', err)
    });
  }

  // Delete the currently viewed lead via the API
  deleteLead() {
    if (confirm("Are you sure you want to delete this lead?")) {
      this.leadService.deleteLead(this.modalLead.id).subscribe({
        next: (res) => {
          console.log("Lead deleted:", res);
          this.loadLeads(); // Refresh the leads list
          this.closeModal();
        },
        error: (err) => console.error('Error deleting lead:', err)
      });
    }
  }
}
