import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SignupServiceService {

  constructor(private http:HttpClient) { }


  url = 'http://localhost:8080/registration'; // 


  registerUser(user: any) {
    return this.http.post<any>(this.url, user);
  }
}
