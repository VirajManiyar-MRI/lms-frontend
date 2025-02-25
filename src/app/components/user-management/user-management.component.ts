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
  users: any[] = []; // Stores all users fetched from the backend
  filteredUsers: any[] = []; // Stores users filtered by search or role
  showUserModal = false; // Controls visibility of the user modal
  isEditMode = false; // Determines whether the modal is in edit mode or add mode

  // User form model (id set to undefined instead of null for type safety)
  userForm = { id: undefined, name: '', email: '', role: '', password: '' };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers(); // Load users when component initializes
  }

  // Fetch users from backend and store in users & filteredUsers arrays
  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      if (Array.isArray(data)) {  // ✅ Ensure it's an array
        this.users = data;
        this.filteredUsers = data;
      } else {
        console.error('Unexpected response format:', data);
        this.users = [];
        this.filteredUsers = [];
      }
    }, error => {
      console.error('Error fetching users:', error);
    });
  }


  // Handles search input event to filter users
  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const query = inputElement.value.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
  }

  // Handles role filter selection to update displayed users
  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const role = selectElement.value;
      this.filteredUsers = role ? this.users.filter(user => user.role === role) : this.users;
    }
  }

  // Opens the user modal in add mode
  openAddUserModal() {
    this.isEditMode = false;
    this.userForm = { id: undefined, name: '', email: '', role: '', password: '' };
    this.showUserModal = true;
  }

  // Opens the user modal in edit mode and pre-fills the form
  openEditUserModal(user: any) {
    this.isEditMode = true;
    this.userForm = { ...user };
    this.showUserModal = true;
  }

  // Saves user data (update if editing, create new if adding)
  saveUser() {
    if (this.isEditMode && this.userForm.id !== undefined) {
      this.userService.updateUser(this.userForm.id, this.userForm).subscribe(() => {
        this.loadUsers();
        this.closeUserModal();
      });
    } else {
      const newUser = { ...this.userForm };
      delete newUser.id; // Ensure id is removed for new user creation
      this.userService.createUser(newUser).subscribe(() => {
        this.loadUsers();
        this.closeUserModal();
      });
    }
  }

  // Deletes a user after confirmation
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  // Closes the user modal
  closeUserModal() {
    this.showUserModal = false;
  }
}
