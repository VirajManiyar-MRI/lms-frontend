import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false; // Added loading state

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true; // Show loading state
    this.errorMessage = ''; // Clear previous errors

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false; // Hide loading

        if (!res.authToken || !res.role) {
          this.errorMessage = 'Login failed. Invalid response from server.';
          return;
        }

        // ✅ Store token & role in localStorage
        this.authService.saveToken(res.authToken, res.role, res.name || 'null');

        // ✅ Redirect based on role
        if (res.role === 'Sales') {
          this.router.navigate(['/lead-status']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false; // Hide loading
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
