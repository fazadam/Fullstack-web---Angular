import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from './card';


@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080';  

  getUserCards(username: string){
    return this.http.get<Card[]>(`${this.url}/cards/${username}`);
  }
}
