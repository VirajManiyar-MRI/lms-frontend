import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userservice.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  showUserModal = false;
  isEditMode = false;
  reportingUsers: any[] = [];
  showReportsToDropdown = false;

  userForm = { id: undefined, name: '', email: '', role: '', password: '', reportsTo: null as number | null };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers();
    console.log('Users Loaded:', this.users);
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data.$values ?? [];
      this.filteredUsers = [...this.users];

      console.log("Users Loaded:", this.users); // Debugging
    }, error => console.error('Error fetching users:', error));
  }

  getReportingManager(id: number | string | null): string {
    if (!id || isNaN(Number(id))) return 'N/A'; // Ensure it's a valid number

    const numericId = Number(id);
    const manager = this.users.find(user => user.id === numericId);

    return manager ? manager.name : 'N/A'; // Return manager name or N/A if not found
  }



  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  onFilterChange(event: Event) {
    const role = (event.target as HTMLSelectElement).value.trim();
    this.filteredUsers = role ? this.users.filter(user => user.role === role) : [...this.users];
  }

  openAddUserModal() {
    this.isEditMode = false;
    this.userForm = { id: undefined, name: '', email: '', role: '', password: '', reportsTo: null };
    this.showUserModal = true;
  }

  openEditUserModal(user: any) {
    this.isEditMode = true;
    this.userForm = { ...user };
    this.showUserModal = true;
    this.onRoleChange();
  }

  onRoleChange() {
    if (this.userForm.role === 'Sales') {
      this.reportingUsers = this.users.filter(user => user.role === 'Manager');
      this.showReportsToDropdown = true;
    } else if (this.userForm.role === 'Manager') {
      this.reportingUsers = this.users.filter(user => user.role === 'Admin');
      this.showReportsToDropdown = true;
    } else {
      this.showReportsToDropdown = false;
      this.userForm.reportsTo = null;
    }
  }

  saveUser() {
    this.userForm.reportsTo = this.userForm.reportsTo ? Number(this.userForm.reportsTo) : null;

    if (this.isEditMode) {
      if (typeof this.userForm.id !== 'number') {
        console.error('Error: User ID is missing or invalid while updating.');
        return;
      }
      this.userService.updateUser(this.userForm.id, this.userForm).subscribe(() => {
        this.loadUsers();
        this.closeUserModal();
      }, error => {
        console.error('Error updating user:', error);
      });
    } else {
      this.userService.createUser(this.userForm).subscribe(() => {
        this.loadUsers();
        this.closeUserModal();
      }, error => {
        console.error('Error creating user:', error);
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  closeUserModal() {
    this.showUserModal = false;
  }
}
