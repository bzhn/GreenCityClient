import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mainUbsLink, mainUserLink } from 'src/app/main/links';
import { UserProfile } from '../../../ubs/ubs-admin/models/ubs-admin.interface';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {
  constructor(private http: HttpClient) {}

  getDataClientProfile() {
    return this.http.get(`${mainUbsLink}/ubs/userProfile/user/getUserProfile`);
  }

  postDataClientProfile(user: UserProfile) {
    return this.http.put(`${mainUbsLink}/ubs/userProfile/user/update`, user);
  }

  deactivateProfile(email: string, reason: string): Observable<void> {
    return this.http
      .get(`${mainUserLink}user/findUuidByEmail`, { params: { email }, responseType: 'text' })
      .pipe(switchMap((uuid: string) => this.http.put<void>(`${mainUserLink}user/deactivate`, { reason }, { params: { uuid } })));
  }
}
