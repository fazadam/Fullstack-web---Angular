import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from './card';
import { GamePlayer } from './game-player';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  drawCardsFromDeck(username: string , deckname: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.url}/draw/${username}/${deckname}`);
  }
  
  // playCard(row: string, index: number): Observable<void> {
  //   const url = `${this.url}/playCard/${row}/${index}`;
  //   return this.http.post<void>(url, null);
  // }

  clearAllCardsFromBoard(){
    return this.http.get<void>(`${this.url}/clearRowsWithCards`)
  }




  // ujfajta jatek apik
  createNewGame(gameName: string, password: string){
    const url = `${this.url}/createNewGame/${gameName}/${password}`;
    return this.http.post(url, {});
  }
  
  setPlayersBoard(gameName: string, gamePlayer: GamePlayer) {
    const url = `${this.url}/setPlayersBoard/${gameName}`;
    return this.http.post(url, gamePlayer);
  }

  playCard(gameName: string, gamePlayer: GamePlayer) {
    const url = `${this.url}/playCard/${gameName}`;

    return this.http.put(url, gamePlayer);

  }

  getGameByName(gameName: string){
    return this.http.get(`${this.url}/getGameStatus/${gameName}`);
  }

  listOfAllGamesCall(){
    return this.http.get<Game[]>(`${this.url}/listOfAllGames`)
  }

  playGame(gameName: string){
    return this.http.get(`${this.url}/${gameName}/play`,{responseType:'text'});
  }

  deleteActiveCardsForNextRound(gameName: string) {
    return this.http.put(`${this.url}/${gameName}/deleteActiveCardsForNextRound`, {});
  }
}
