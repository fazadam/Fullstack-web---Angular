import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from './card';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  drawCardsFromDeck(username: string , deckname: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.url}/draw/${username}/${deckname}`);
  }
  
  playCard(row: string, index: number): Observable<void> {
    const url = `${this.url}/playCard/${row}/${index}`;
    return this.http.post<void>(url, null);
  }

  clearAllCardsFromBoard(){
    return this.http.get<void>(`${this.url}/clearRowsWithCards`)
  }

}
