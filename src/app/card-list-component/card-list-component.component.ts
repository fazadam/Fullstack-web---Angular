import { Component, OnInit } from '@angular/core';
import { Card } from '../card';
import { CardServiceService } from '../card-service.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../user';
import { LoginServiceAuthService } from '../login-service-auth.service';

@Component({
  selector: 'app-card-list-component',
  templateUrl: './card-list-component.component.html',
  styleUrls: ['./card-list-component.component.css']
})
export class CardListComponentComponent implements OnInit {

  user!: User[];
  userDecksName!: string[];
  selectedDeckCards!: Card[];
  selectedDeckName!: string;
  selectedDeckCardsString: string[] = [];

  specificDeckContainer: boolean = false;

  cards!: Card[];
  showNewDeckRow: boolean = false;
  newDeckCards!: Card[];
  errorMsg!: string;
  newDeckCardsString: string[] = [];


  constructor(private cardService: CardServiceService, private formbuilder: FormBuilder,private loginService: LoginServiceAuthService) { }

  loggedinUser = localStorage.getItem('loggedInUser') ?? '';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }


  deckForm = this.formbuilder.group({
    deckName: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });



  ngOnInit(): void {
    this.cardService.getAllCards().subscribe(cards => {
      this.cards = cards;
      console.log('cards' + cards)
      this.cards.forEach(card => {
        card.picture = 'data:image/png;base64,' + card.picture;
      });
    });
    this.newDeckCards = [];


    this.loginService.getUser(localStorage.getItem('loggedInUser')).subscribe({
      next: (response) => {
        this.userDecksName = Object.keys(response.userDecks);

      },
      error: (err) => {
        console.log(err);
      },
    });
  }



  showSpecificDecksCards(deckName : string){
    this.cardService.getUsersDeckCards(localStorage.getItem('loggedInUser')?? '',deckName).subscribe(deckCards => {
      this.selectedDeckCards = deckCards;
      console.log('cards' + deckCards)
      this.selectedDeckCards.forEach(card => {
        card.picture = 'data:image/png;base64,' + card.picture;
      });
    });
    this.specificDeckContainer = true;
    this.selectedDeckName = deckName;

  }



  showCreateNewDeck() {
    this.showNewDeckRow = !this.showNewDeckRow;
    this.newDeckCards = [];
  }

  removeFromNewDeck(card: Card) {
    for (let i = 0; i < this.newDeckCards.length; i++) {
      if (this.newDeckCards[i].name === card.name) {
        this.newDeckCards.splice(i, 1);
        this.newDeckCardsString.splice(i, 1);

        break;
      }
    }
  }

  addCardToNewDeck(card: Card) {
    let cardCountInDeck = 0;

    for (let i = 0; i < this.newDeckCards.length; i++) {
      if (this.newDeckCards[i].name == card.name) {
        cardCountInDeck++;
      }
    }
    // max ketszer legyen benne a deckben
    if (cardCountInDeck < 2) {
      this.newDeckCards.push(card);
      this.newDeckCardsString.push(card.name.toString()); 
      console.log(card)
    }

  }


  

  saveNewDeckToUser() {

    console.log(this.newDeckCardsString)

    

    if (this.deckForm.get('deckName') && this.newDeckCards.length >= 5) {

      this.cardService.createDeck(this.loggedinUser, this.deckForm.get('deckName')?.value ?? '', this.newDeckCardsString)
        .subscribe({
          
          next: () => {
            console.log('new deck was sent to the backend');
            window.location.reload();

          },
          error: (err) => {
            console.log('failed to send deck');
            this.errorMsg = "fill the deckname and select at least 20 cards"

            console.log(err);
          },
        });
    }
  }

  deleteUserDeck(deckName : string){
    this.cardService.deleteUserDeck(localStorage.getItem('loggedInUser')?? '', deckName)
    .subscribe({
      next: () => {
        console.log('User: ' + localStorage.getItem('loggedInUser') + 'deck deleted: ' + deckName);
        window.location.reload();

      },
      error: (err) => {
        console.log('Deck not delted');
  
        console.log(err);
      },
    });
  }


}
