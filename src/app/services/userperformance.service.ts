import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserPerformanceService {
  private apiUrl = 'http://localhost:5128/api/UserPerformance';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Fetch manager performance data
  getManagerPerformance(): Observable<any> {
    const headers = this.authService.getAuthHeaders(); // Attach Auth Headers
    return this.http.get(`${this.apiUrl}`, { headers });
  }
}
