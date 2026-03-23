import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed, } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  // setup connection
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/parties`;

  createParty(partyData: { name: string; description: string; techStack: string[] }): Observable<any> {
    return this.http.post(`${this.API}`, partyData);
  }

  getParties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}`);
  }

  getPartyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  joinParty(partyId: string): Observable<any> {
    return this.http.post(`${this.API}/${partyId}/join`, {});
  }

  leaveParty(partyId: string): Observable<any> {
    return this.http.post(`${this.API}/${partyId}/leave`, {});
  }

  acceptQuest(partyId: string, questId: string): Observable<any> {
    return this.http.post(`${this.API}/${partyId}/accept-quest/${questId}`, {});
  }
  

}
