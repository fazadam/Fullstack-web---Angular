import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from './card';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080';  

  getUserCards(username: string){
    return this.http.get<Card[]>(`${this.url}/cards/${username}`);
  }

  getAllCards(){
    return this.http.get<Card[]>(`${this.url}/allCards`);
  }

  deleteCard(cardName: string) {
    return this.http.put<any>(`${this.url}/deleteCard/${cardName}`, {});
  }

  createCard(card : Card){
    return this.http.put<Card>(`${this.url}/createNewCardFrontend`, card);

  }

  createDeck(username: string, deckname: string, cardList: String[]) {
    console.log(cardList)
    console.log(`Payload size: ${JSON.stringify(cardList).length} bytes`);
    return this.http.put<any>(`${this.url}/${username}/cards/${deckname}`, cardList);
  }

  getUsersDeckCards(username: string, deckname: string){
    return this.http.get<Card[]>(`${this.url}/${username}/cards/${deckname}/deckCards`);

  }

  deleteUserDeck(username: string, deckName: string) {
    return this.http.put<any>(`${this.url}/${username}/cards/${deckName}/deleteDeck`, {});
  }
}
