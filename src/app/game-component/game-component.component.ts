import { Component, OnDestroy, OnInit } from '@angular/core';
import { Card } from '../card';
import { GameService } from '../game-service.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceAuthService } from '../login-service-auth.service';
import { User } from '../user';
import { CardServiceService } from '../card-service.service';
import { GamePlayer } from '../game-player';
import { Game } from '../game';

@Component({
  selector: 'app-game-component',
  templateUrl: './game-component.component.html',
  styleUrls: ['./game-component.component.css']
})
export class GameComponentComponent {

  erromsg!: string;
  user!: User[];
  userDecksName!: string[];
  deckName!: string;
  selectedDeckCards!: Card[];
  selectedDeckName!: string;
  deckIsChosen!: boolean; 
  playButtonHit!: boolean
  showNextRoundButton!: boolean
  activeCardShow!: boolean
  showGameState!:boolean
  loggedInPoints!: number
  enemeyPoint!: number

  //uj jatek
  gamePlayer!: GamePlayer;
  gameStatus!: Game;
  listOfAllGames: Game[] = [];
  selectedGame!: Game;
  createOrCurrentlyJoinedGame!: boolean; 
  usedDeckAssigned!: boolean;

  showCreateGameForm!: boolean;
  showListOfGamesForm!: boolean;
  enemyActiveCardShow!: boolean
  errorMessage!: string;

  playGameState!: string;

  gameForm!: FormGroup;


  handCards!: Card[];

  activeCardPage!: Card;
  enemyActiveCard: Card | undefined | null;



  constructor(private cardService: CardServiceService, private formBuilder: FormBuilder, private gameService: GameService, private router: Router, private loginService: LoginServiceAuthService) {  
}

  loggedinUser = localStorage.getItem('loggedInUser') ?? '';

  createGameForm = new FormGroup({
    gameName: new FormControl(''),
    gamePassword: new FormControl(''),
  })

  listOfCurrentGames = new FormGroup({
    password: new FormControl('')
  });

  game: any = {
    gameName: this.createGameForm.get('gameName')?.value,
    gamePassword: this.createGameForm.get('gamePassword')?.value
  }


  // toltsuk be azt a random 10 kartyat a deckbol a hand listaba
  ngOnInit() {

    console.log("aktualis handcards = "+ this.handCards)
    this.activeCardShow = true;
    this.gameForm = this.formBuilder.group({
      selectedCard: ['', Validators.required]


    });

    this.gamePlayer = new GamePlayer(this.loggedinUser, this.handCards, this.activeCardPage, 0, 0);


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

  showChoosenDeck(deckName: string) {
    // ========== deck kivalasztasa es kartyak kezbe huzasa =============
    // this.cardService.getUsersDeckCards(localStorage.getItem('loggedInUser')?? '',deckName).subscribe(deckCards => {
    //   this.selectedDeckCards = deckCards;
    //   console.log('cards' + deckCards)
    // });
    console.log(this.selectedDeckName)
    this.selectedDeckName = deckName;
    this.activeCardPage = new Card('', '', '');
    this.activeCardShow = false


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

  selectedCardToPlay(index: number, name: string) {

    const currentGame = this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'));
    const loggedInUser = localStorage.getItem('loggedInUser');
    const currentPlayer = currentGame?.players.find(player => player.playerName === loggedInUser);



    //ha mar van aktiv kartyaja behelyezve akkor ne engedje 
    if (currentPlayer?.activeCard == null) {
      
      console.log("THIS IS CURRENT CARD WHEN CLICK PALY" + currentPlayer?.activeCard)
      const selectedCard = this.handCards[index];

      if (selectedCard) {
        this.handCards.splice(index, 1);
        this.activeCardPage = selectedCard;
        console.log(selectedCard)
        console.log(this.activeCardPage)

        this.gamePlayer.activeCard = this.activeCardPage;
        this.gamePlayer.currentDeckCards = this.handCards;

        this.gameService.playCard(localStorage.getItem('currentGameName') ?? '', this.gamePlayer)
          .subscribe({
            next: () => {
              console.log('sikeresen hozzaadva a DB aktiv kartyajahoz' + selectedCard);
              console.log(this.gamePlayer)
              this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'));
              this.activeCardShow = true
            },
            error: (error) => {
              console.log('hiba a kartya kijatszasakor ');
              console.log(this.errorMessage);
              this.errorMessage = error.error;

            }
          })

      };
    }
    else {
      this.erromsg = "YOU ALREADY CHOOSE CARD, WAITING OTHER PLAYER TO CHOOSE"
    }
  }




  showCreateGameFormClick() {
    this.showCreateGameForm = true;
    this.showListOfGamesForm = false;
  }

  showListOfGamesClick() {
    this.showCreateGameForm = false;
    this.showListOfGamesForm = true;

    this.gameService.listOfAllGamesCall().subscribe((allGames) => {
      console.log(allGames)


      this.listOfAllGames = allGames;
    });




  }

  onCreateNewGameButton() {


    this.gameService.createNewGame(this.createGameForm.get('gameName')?.value || '', this.createGameForm.get('gamePassword')?.value || '')
      .subscribe({
        next: (data) => {
          console.log('sikeres uj jatek krealas');
          console.log('gamename = ' + this.createGameForm.get('gameName')?.value || '');
          console.log('gamepw = ' + this.createGameForm.get('gamePassword')?.value || '');
          localStorage.setItem('currentGameName', this.createGameForm.get('gameName')?.value || '')
          this.showCreateGameForm = false;
          this.deckIsChosen = false

          this.createOrCurrentlyJoinedGame = true;
        },
        error: (error) => {
          console.log('hiba a jatek letrehozasakor');
          console.log(this.errorMessage);
          this.errorMessage = error.error;
          console.log('gamename = ' + this.createGameForm.get('gameName')?.value || '');
          console.log('gamepw = ' + this.createGameForm.get('gamePassword')?.value || '');
        }
      })
  }



  onJoinGameButton(gameName: string) {
    const selectedGame = this.listOfAllGames.find(game => game.gameName === gameName);
    const loggedInUser = localStorage.getItem('loggedInUser');
    const currentPlayer = selectedGame?.players.find(player => player.playerName === loggedInUser);
  
    if (selectedGame?.gamePassword !== this.listOfCurrentGames.get('password')?.value) {
      this.erromsg = 'Password is incorrect';
      return;
    }
  
    if (selectedGame?.players.length === 1) {
      console.log('Only 1 player in the game, connecting automatically');
  
      if (currentPlayer?.activeCard == null) {
        this.showListOfGamesForm = false;
        this.createOrCurrentlyJoinedGame = true;
      } else {
        this.handCards = currentPlayer.currentDeckCards;
        this.usedDeckAssigned = true;
        this.activeCardPage = currentPlayer.activeCard;
      }
  
      localStorage.setItem('currentGameName', selectedGame.gameName);
      console.log(localStorage.getItem('currentGameName'));


    } else if (selectedGame?.players.length === 2) {
      if (selectedGame.players.some(player => player.playerName === loggedInUser)) {
        if (currentPlayer?.activeCard != null) {
          this.activeCardPage = currentPlayer.activeCard;
          console.log('ketszemelyes jatekban az aktiv felhasznalo mar valazstott kartyat' + this.activeCardPage);
        }
  
        this.handCards = currentPlayer!.currentDeckCards;
        this.showListOfGamesForm = false;
        console.log('Password is correct');
        localStorage.setItem('currentGameName', selectedGame.gameName);
        console.log(localStorage.getItem('currentGameName'));
      } else {
        this.erromsg = 'You are not a player in this game';
      }
    } else {
      this.erromsg = 'Game is full, cannot join';
    }
  
    console.log(currentPlayer);
    console.log(this.activeCardPage);
  }
  


  playGame(){

    const selectedGame = this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'));
    const loggedInUser = localStorage.getItem('loggedInUser');
    const otherPlayer = selectedGame?.players.find(player => player.playerName !== loggedInUser);

    console.log("selected game = " + selectedGame?.gameName)
    console.log("loggedinuser = " + loggedInUser)
    console.log("other player game = " + otherPlayer?.playerName)
    console.log(selectedGame?.players.length)


    if (selectedGame?.players.length === 1){
      if (selectedGame?.players[0].playerName === loggedInUser) {
        this.erromsg = "Waiting for another player to join and choose a card.";
      } else {
        this.erromsg = "Please choose a card first.";
      }
      return;
    }
  
    //ez felesleges, mert csak akkor menti a DBbe ha valaszt egy aktiv kartyat
    if (otherPlayer?.activeCard == null) {
      this.enemyActiveCard = undefined;
      this.erromsg = 'The other player has not chosen a card yet.';
      return;
    }
  
    if (selectedGame?.players.length === 2 && selectedGame?.players.every(player => player.activeCard)) {
      console.log("Both players have chosen a card!");
      this.enemyActiveCard = otherPlayer.activeCard;
      this.enemyActiveCardShow = true;
      // jatek pontok szamitasa.

      this.gameService.playGame(selectedGame.gameName)
      .subscribe({
        next: (responseGameState) => {
          this.playGameState = responseGameState;
          console.log(typeof(responseGameState))
          this.showNextRoundButton = true;
          this.showGameState = true;
        },
        error: (err) => {
          console.log('nem sikerult game');
          this.erromsg = err;
          console.log(err);
        },
      });
      this.gameService.playGame(selectedGame.gameName)
      .subscribe(result => {
        this.playGameState = result;
        console.log('Result:', result);
        console.log('playGameState:', this.playGameState);
      });
    

      this.playButtonHit = true;
      this.showNextRoundButton = true;
    } else {
      
      this.erromsg = "There are not enough players, or not all players have chosen an active card yet!";
    }
  }

  nextRound(){
    const selectedGame = this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'));

    if (!selectedGame) {
      console.log('No game selected!');
      return;
    }

    this.activeCardPage = new Card('','','')
    this.enemyActiveCard = new Card('','','')
    this.showNextRoundButton = false;
    this.activeCardShow = false;
    this.showGameState = false;


    this.enemyActiveCardShow = false;

      this.gameService.deleteActiveCardsForNextRound(selectedGame.gameName)
      .subscribe({
        next: () => {
          console.log('Active cards deleted here' + selectedGame.gameName);
        },
        error: (err) => {
          console.log('Active cards NOT deleted here');
    
          console.log(err);
        },
      });
    }  
}