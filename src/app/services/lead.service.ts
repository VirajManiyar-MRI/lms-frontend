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

  // ✅ Fetch leads with authorization headers
  getLeads(): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // ✅ Add Authorization Header
    return this.http.get(this.apiUrl, { headers });
  }
}
