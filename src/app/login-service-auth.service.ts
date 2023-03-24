import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginServiceAuthService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080'; // 


  login(user:any){
    console.log(user)
    return this.http.post<any>(`${this.url}/login`,user);
  }

  getUser(username:any) {
    return this.http.get<any>(`${this.url}/profile/${username}`);
  }

  updateProfile(username: string, user:any) {
    console.log(user );
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfile`,user);
  }

  updateProfileUsername(username: string, newUsername : any){
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfileUsername`, newUsername);
  }

  updateProfileEmail(username: string, newEmail : any){
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfileEmail`, newEmail);
  }

  updateProfilePassword(username: string, newPassword : any){
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfilePassword`, newPassword);
  }
}
