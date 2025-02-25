import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  reportsTo?: number | null; // Ensuring it can be null if not applicable
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5128/api/user'; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: Partial<User>): Observable<any> {
    const payload = {
      ...user,
      reportsTo: user.reportsTo ?? null  // Ensure it's sent as null if undefined
    };
    return this.http.post(this.apiUrl, payload, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, user: Partial<User>): Observable<any> {
    const payload = {
      ...user,
      reportsTo: user.reportsTo ?? null  // Ensure it's sent as null if undefined
    };
    return this.http.put(`${this.apiUrl}/${id}`, payload, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
