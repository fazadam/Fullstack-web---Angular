import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Role } from './role';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class LoginServiceAuthService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080'; // 


  isAdmin(): Observable<boolean> {
    if (!localStorage.getItem('loggedInUser')) {
      return of(false);
    } else {
      return this.getRoles(localStorage.getItem('loggedInUser') ?? '').pipe(
        map((roles: string[]) => roles.includes('ROLE_ADMIN'))
      )
    }
  }

  login(user: any) {
    console.log(user)
    return this.http.post<any>(`${this.url}/login`, user);
  }

  getUser(username: any) {
    return this.http.get<any>(`${this.url}/profile/${username}`);
  }

  getRoles(username: string) {
    return this.http.get<string[]>(`${this.url}/roles/${username}`);
  }

  setPendingAdminRequest(username: any) {
    return this.http.post<any>(`${this.url}/profile/${username}/adminRequest`, username);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/adminPage`);
  }

  getAllPendingRequests(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/pendingRequestsList`);
  }

  grantAdminRole(username: string) {
    return this.http.put<any>(`${this.url}/profile/grandAdminRequest/${username}`, {});
  }

  declineAdminRole(username: string) {
    return this.http.put<any>(`${this.url}/profile/declineAdminRequest/${username}`, {});
  }

  revokeAdminRole(username: string) {
    return this.http.put<any>(`${this.url}/profile/revokeAdminRole/${username}`, {});
  }
  deleteUser(username: string) {
    return this.http.put<any>(`${this.url}/profile/deleteUser/${username}`, {});
  }




  setFavouriteVideos(username: string, favouriteVideos: string) {
    return this.http.put(`${this.url}/${username}/setfavoriteVideos`, favouriteVideos);
  }

  getFavouriteVideos(username: string) {
    return this.http.get<string[]>(`${this.url}/${username}/getfavoriteVideos`);
  }

  deleteFavouriteVideos(username: string, favouriteVideos: string) {
    return this.http.put(`${this.url}/${username}/deletefavoriteVideos`, favouriteVideos);
  }






  updateProfile(username: string, user: any) {
    console.log(user);
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfile`, user);
  }

  updateProfileUsername(username: string, newUsername: any) {
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfileUsername`, newUsername);
  }

  updateProfileEmail(username: string, newEmail: any) {
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfileEmail`, newEmail);
  }

  updateProfilePassword(username: string, newPassword: any) {
    return this.http.put<string>(`${this.url}/profile/${username}/updateProfilePassword`, newPassword);
  }
}
