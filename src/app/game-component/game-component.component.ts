import { Component, OnDestroy, OnInit } from '@angular/core';
import { Card } from '../card';
import { GameService } from '../game-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceAuthService } from '../login-service-auth.service';
import { User } from '../user';
import { CardServiceService } from '../card-service.service';

@Component({
  selector: 'app-game-component',
  templateUrl: './game-component.component.html',
  styleUrls: ['./game-component.component.css']
})
export class GameComponentComponent {

  user!: User[];
  userDecksName!: string[];
  deckName!: string;
  selectedDeckCards!: Card[];
  selectedDeckName!: string;
  deckIsChosen!: boolean;


  gameForm!: FormGroup;
  handCards!: Card[];
  meleeCards!: Card[];
  rangedCards!: Card[];
  siegeCards!: Card[];

  rangedRowSum!: number;
  meleeRowSum!: number;
  siegeRowSum!: number;
  rowSumTotal!: number;

  constructor(private cardService: CardServiceService,private formBuilder: FormBuilder, private gameService: GameService, private router: Router,private loginService: LoginServiceAuthService) { }

  loggedinUser = localStorage.getItem('loggedInUser') ?? '';


  // toltsuk be azt a random 10 kartyat a deckbol a hand listaba
  ngOnInit() {

    this.rowSumTotal = 0;
    this.meleeRowSum = 0;
    this.rangedRowSum = 0;
    this.siegeRowSum = 0;

    this.meleeCards = [];
    this.rangedCards = [];
    this.siegeCards = [];


    this.gameForm = this.formBuilder.group({
      selectedCard: ['', Validators.required]
    });

    // =============================== KARTYA KEZBE HUZAS ===================================
    // this.gameService.drawCardsFromDeck(this.loggedinUser).subscribe(handCards => {
    //   this.handCards = handCards;
    //   this.handCards.forEach(card => {
    //     card.picture = 'data:image/png;base64,' + card.picture;
    //   })
    //     ;
    // });

    // =========== deckek betolteses =========
    this.loginService.getUser(localStorage.getItem('loggedInUser')).subscribe({
      next: (response) => {
        this.userDecksName = Object.keys(response.userDecks);

      },
      error: (err) => {
        console.log(err);
      },
    });


  }

  showChoosenDeck(deckName : string){
        // ========== deck kivalasztasa es kartyak kezbe huzasa =============
        // this.cardService.getUsersDeckCards(localStorage.getItem('loggedInUser')?? '',deckName).subscribe(deckCards => {
        //   this.selectedDeckCards = deckCards;
        //   console.log('cards' + deckCards)
        // });
        this.selectedDeckName = deckName;

        this.gameService.drawCardsFromDeck(this.loggedinUser, deckName).subscribe(recievedRandomCards => {
          this.handCards = recievedRandomCards;
          console.log(this.handCards)
          this.handCards.forEach(card => {
            card.picture = 'data:image/png;base64,' + card.picture;
          })
            ;
        });
        this.deckIsChosen = true;
      
  }

  // =============================== KARTYARA KATT --> SORINDEX ES ROW TIPUS VISSZAADAS + ATADAS A SOROKNAK ===================================

  selectedCardToPlay(index: number, type: string) {
    const selectedCard = this.handCards[index];
    if (selectedCard) {
      this.gameService.playCard(type, index).subscribe(() => {
        this.handCards.splice(index, 1); 


        switch (type) {
          case 'melee': {
            this.meleeCards.push(selectedCard); 
            this.meleeRowSum += selectedCard.power; 
            break;
          }
          case 'ranged': {
            this.rangedCards.push(selectedCard); 
            this.rangedRowSum += selectedCard.power; 
            break;
          }
          case 'siege': {
            this.siegeCards.push(selectedCard); 
            this.siegeRowSum += selectedCard.power;
            break;
          }
        }
        this.rowSumTotal = this.siegeRowSum + this.rangedRowSum + this.meleeRowSum;
      });
    }
  }
  

  // =============================== ELNAVIGALASKOR SOROK TORLESE ===================================

  //EZ IS FELESLEGES API?????
  // ngOnDestroy() {
  //   //if (this.router.url !== '/game') { this.gameService.clearAllCardsFromBoard().subscribe() };
  //   //this.subscriptions.forEach(sub => sub.unsubscribe());
  //   // this.meleeCards = [];
  //   // this.rangedCards = [];
  //   // this.sageCards = [];
  // }
}