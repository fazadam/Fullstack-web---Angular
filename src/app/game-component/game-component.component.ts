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
  createOrCurrentlyJoinedGame!: boolean; 
  usedDeckAssigned!: boolean;

  showCreateGameForm!: boolean;
  showListOfGamesForm!: boolean;
  enemyActiveCardShow!: boolean
  errorMessage!: string;

  playGameState!: string;

  gameForm!: FormGroup;


  handCards!: Card[];

  activeCardPage!: Card| undefined ;
  enemyActiveCard: Card | undefined ;

  
  currentGame!: Game | undefined;
  loggedInUser = localStorage.getItem('loggedInUser');
  //currentPlayer = this.currentGame?.players.find(player => player.playerName === this.loggedInUser);
  //otherPlayer = this.currentGame?.players.find(player => player.playerName !== this.loggedInUser);

  currentPlayer?: GamePlayer
  otherPlayer?: GamePlayer




  constructor(private cardService: CardServiceService, private formBuilder: FormBuilder, private gameService: GameService, private router: Router, private loginService: LoginServiceAuthService) {  
}

  loggedinUser = localStorage.getItem('loggedInUser') ?? '';

  createGameForm = new FormGroup({
    gameName: new FormControl(''),
    gamePassword: new FormControl(''),
  })

  listOfCurrentGames = new FormGroup({
    gameNameInTheList: new FormControl(''),
    password: new FormControl('')
  });

  game: any = {
    gamePassword: this.createGameForm.get('gamePassword')?.value
  }


  // toltsuk be azt a random 10 kartyat a deckbol a hand listaba
  ngOnInit() {

    console.log("active card = " + this.activeCardPage)
    console.log("aktualis handcards = "+ this.handCards)
    this.activeCardShow = true;
    this.gameForm = this.formBuilder.group({
      selectedCard: ['', Validators.required]


    });

    //this.gamePlayer = new GamePlayer(this.loggedinUser, this.handCards, this.activeCardPage, 0, 0);

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

    console.log(this.selectedDeckName)
    this.selectedDeckName = deckName;
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

    this.currentGame = this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'))
    this.currentPlayer = this.currentGame?.players.find(player => player.playerName === this.loggedInUser)
    this.otherPlayer = this.currentGame?.players.find(player => player.playerName !== this.loggedInUser)

    console.log("currentgame " + this.currentGame)
    console.log("currentPlayer " + this.currentPlayer)
    console.log("otherPlayer " + this.otherPlayer)
    console.log("active card = " + this.activeCardPage)

    //ha mar van aktiv kartyaja behelyezve akkor ne engedje 
    if (this.activeCardPage == null || this.activeCardPage == undefined) {
      
      console.log("THIS IS CURRENT CARD WHEN CLICK PALY" + this.currentPlayer?.activeCard)
      const selectedCard = this.handCards[index];

      if (selectedCard) {
        this.handCards.splice(index, 1);
        this.activeCardPage = selectedCard;
        console.log(selectedCard)
        console.log(this.activeCardPage)


        if(this.currentPlayer){
          this.currentPlayer.activeCard = selectedCard;
          this.currentPlayer.currentDeckCards = this.handCards;
        }




        this.gameService.playCard(localStorage.getItem('currentGameName') ?? '', new GamePlayer(this.loggedInUser?? '',this.handCards,selectedCard,0,0))
          .subscribe({
            next: () => {
              console.log('sikeresen hozzaadva a DB aktiv kartyajahoz' + selectedCard);
              this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'));
              this.activeCardShow = true

              console.log('currentplayer active card in playcard = ' + this.currentPlayer?.activeCard)
              console.log('currentplayer active card in currentdeck = ' + this.currentPlayer?.currentDeckCards)
              console.log('currentplayername = ' + this.currentPlayer)

              if (this.currentPlayer?.playerName === localStorage.getItem('loggedInUser')) {
                this.activeCardPage = this.currentPlayer.activeCard;
              } else {
                this.enemyActiveCard   = this.otherPlayer?.activeCard;
              }

              //irja felul a listofallgames-t, hogy mar mindket jatekos benne legyen --> igy a playgame mar uj jatekkor is elso korben ki tudja ertekelni a pontokat oldal frissites nelkul
              this.gameService.listOfAllGamesCall().subscribe((allGames) => {
                console.log(allGames)
          
          
                this.listOfAllGames = allGames;
              });
              
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

    this.currentGame = this.listOfAllGames.find(game => game.gameName === gameName)
    this.currentPlayer = this.currentGame?.players.find(player => player.playerName === this.loggedInUser)
    this.otherPlayer = this.currentGame?.players.find(player => player.playerName !== this.loggedInUser)

    console.log("lsitofallgames + " + this.listOfAllGames)
    console.log(this.currentPlayer?.playerName)
    console.log(this.loggedInUser)
    console.log(this.otherPlayer?.playerName)
    console.log(this.currentGame?.gameName)

    if (this.currentGame?.gamePassword !== this.listOfCurrentGames.get('password')?.value) {
      this.erromsg = 'Password is incorrect';
      return;
    }
  
    if (this.currentGame?.players.length === 1) {
      console.log('Only 1 player in the game, connecting automatically');
  
      if (this.currentPlayer?.activeCard == null) {
        this.showListOfGamesForm = false;
        this.createOrCurrentlyJoinedGame = true;
      } else {
        this.handCards = this.currentPlayer.currentDeckCards;
        this.usedDeckAssigned = true;
        this.activeCardPage = this.currentPlayer.activeCard;
      }
  
      localStorage.setItem('currentGameName', this.currentGame.gameName);
      console.log(localStorage.getItem('currentGameName'));


    } else if (this.currentGame?.players.length === 2) {
      if (this.currentGame.players.some(player => player.playerName === this.loggedInUser)) {
        if (this.currentPlayer?.activeCard != null) {
          this.activeCardPage = this.currentPlayer.activeCard;
          console.log('ketszemelyes jatekban az aktiv felhasznalo mar valazstott kartyat' + this.activeCardPage);
        }
  
        this.handCards = this.currentPlayer!.currentDeckCards;
        this.showListOfGamesForm = false;
        console.log('Password is correct');
        localStorage.setItem('currentGameName', this.currentGame.gameName);
        console.log(localStorage.getItem('currentGameName'));
      } else {
        this.erromsg = 'You are not a player in this game';
      }
    } else {
      this.erromsg = 'Game is full, cannot join';
    }
  
    console.log(this.currentPlayer);
    console.log(this.activeCardPage);
  }
  


  playGame(){

    
    this.currentGame = this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'))
    this.currentPlayer = this.currentGame?.players.find(player => player.playerName === this.loggedInUser)
    this.otherPlayer = this.currentGame?.players.find(player => player.playerName !== this.loggedInUser)


    console.log("selected game = " + this.currentGame?.gameName)
    console.log("loggedinuser = " + this.loggedInUser)
    console.log("other player game = " + this.otherPlayer?.playerName)
    console.log("curent payer = " + this.currentPlayer )
    console.log(this.currentGame?.players.length)


    if (this.currentGame?.players.length === 1){
      if (this.currentGame?.players[0].playerName === this.loggedInUser) {
        this.erromsg = "Waiting for another player to join and choose a card.";
      } else {
        this.erromsg = "Please choose a card first.";
      }
      return;
    }
  
    //ez felesleges, mert csak akkor menti a DBbe ha valaszt egy aktiv kartyat
    if (this.otherPlayer?.activeCard == null) {
      this.enemyActiveCard = undefined;
      this.erromsg = 'The other player has not chosen a card yet.';
      return;
    }
  
    if (this.currentGame?.players.length === 2 && this.currentGame?.players.every(player => player.activeCard)) {
      console.log("Both players have chosen a card!");
      this.enemyActiveCard = this.otherPlayer.activeCard;
      this.enemyActiveCardShow = true;
      // jatek pontok szamitasa.

      this.gameService.playGame(this.currentGame.gameName)
      .subscribe({
        next: (responseGameState) => {
          this.playGameState = responseGameState;
          console.log(typeof(responseGameState))
          this.showNextRoundButton = true;
          this.showGameState = true;

          if(this.currentPlayer!.gamePoints >= 5 || this.otherPlayer!.gamePoints >= 5){
            this.showNextRoundButton = false;
          }
        },
        error: (err) => {
          console.log('nem sikerult game');
          this.erromsg = err;
          console.log(err);
        },
      });

      this.playButtonHit = true;
      this.showNextRoundButton = true;
    } else {
      
      this.erromsg = "There are not enough players, or not all players have chosen an active card yet!";
    }
  }

  nextRound(){
    this.currentGame = this.listOfAllGames.find(game => game.gameName === localStorage.getItem('currentGameName'))
    this.currentGame?.players.find(player => player.playerName === this.loggedInUser)

    if (!this.currentGame) {
      console.log('No game selected!');
      return;
    }

    this.enemyActiveCard = undefined
    this.showNextRoundButton = false;
    this.activeCardShow = false;
    this.showGameState = false;


    this.enemyActiveCardShow = false;

      this.gameService.deleteActiveCardsForNextRound(this.currentGame.gameName)
      .subscribe({
        next: () => {
          console.log('Active cards deleted here' + this.currentGame?.gameName);
          this.enemyActiveCard = undefined
          this.activeCardPage = undefined;
          this.erromsg = "wait other player to choose"
        },
        error: (err) => {
          console.log('Active cards NOT deleted here');
    
          console.log(err);
        },
      });
    }  
}