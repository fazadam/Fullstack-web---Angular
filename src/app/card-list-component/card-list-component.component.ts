import { Component,OnInit } from '@angular/core';
import { Card } from '../card';
import { CardServiceService } from '../card-service.service';

@Component({
  selector: 'app-card-list-component',
  templateUrl: './card-list-component.component.html',
  styleUrls: ['./card-list-component.component.css']
})
export class CardListComponentComponent implements OnInit {


  cards!: Card[];

  constructor(private cardService:CardServiceService){}

loggedinUser = localStorage.getItem('loggedInUser')?? '';

isLoggedIn(): boolean {
  return !!localStorage.getItem('loggedInUser');
}



  ngOnInit(): void {
    this.cardService.getUserCards(this.loggedinUser).subscribe(cards => {
        this.cards = cards;
        this.cards.forEach(card => {
          card.picture = 'data:image/png;base64,' + card.picture;
        });
  });
  }

}
