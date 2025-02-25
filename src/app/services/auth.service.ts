import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5128/api/Auth'; // Backend API URL

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any, private router: Router) { }

  // ✅ Login API call
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // ✅ Signup API call
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // ✅ Save token and role in local storage
  saveToken(token: string, role: string , name : string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token.trim());
      localStorage.setItem('name', name);
      localStorage.setItem('userRole', role);

    }
  }

  // ✅ Get JWT Token
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const token = localStorage.getItem('authToken');
    return token ? token.trim() : null; // Ensure no extra spaces
  }

  // ✅ Get User Role
  getUserRole(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('userRole') : null;
  }

  // ✅ Get User Name
  getUserName(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('name') : null;
  }


  // ✅ Check if user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // If token exists, return true, else false
  }

  
  // ✅ Logout user and clear storage
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']).then(() => {
        window.location.reload(); // ✅ Ensures fresh state
      });
    }
  }


  // ✅ Get headers with authorization token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
}

