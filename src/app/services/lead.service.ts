import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = 'http://localhost:5128/api/Lead'; // Backend API URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Fetch leads with authorization headers
  getLeads(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  // Create a new lead
  createLead(lead: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(this.apiUrl, lead, { headers });
  }

  // Update an existing lead
  updateLead(id: number, lead: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, lead, { headers });
  }

  // Delete a lead
  deleteLead(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
