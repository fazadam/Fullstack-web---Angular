import { Component, OnInit } from '@angular/core';
import { LoginServiceAuthService } from '../login-service-auth.service';
import { Card } from '../card';
import { User } from '../user';
import { CardServiceService } from '../card-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-component',
  templateUrl: './admin-component.component.html',
  styleUrls: ['./admin-component.component.css']
})
export class AdminComponentComponent implements OnInit{

  showAddCard: boolean = false;
  cards!: Card[];
  users!: User[];
  usersWithPendingRequests!: User[];


  cardImageBase64!: string;



  constructor(private loginService: LoginServiceAuthService, private cardService: CardServiceService,){}

  addNewCard = new FormGroup({
    cardName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern('^[a-zA-Z ]*$')
    ]),
    cardPower: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(40),
      Validators.pattern('^[0-9]*$') 
    ]),
    cardType: new FormControl('', [
      Validators.required
    ]),
    picture: new FormControl('',[
      Validators.required
    ]),
  });

  ngOnInit(): void {
    this.loginService.getAllUsers().subscribe((users) => {
      this.users = users;
    });

    this.loginService.getAllPendingRequests().subscribe((users) => {
      this.usersWithPendingRequests = users;
    });

    this.cardService.getAllCards().subscribe(cards => {
      this.cards = cards;
      console.log('cards'+ cards)
      this.cards.forEach(card => {
        card.picture = 'data:image/png;base64,' + card.picture;
      });
});

  }
deleteUser(username: string) {
  this.loginService.deleteUser(username)
  .subscribe({
    next: () => {
      console.log('User deleted' + username);
    },
    error: (err) => {
      console.log('User deletion failed');

      console.log(err);
    },
  });
}

acceptRequest(username: string) {
  this.loginService.grantAdminRole(username)
  .subscribe({
    next: () => {
      console.log('Admin role was granted');
    },
    error: (err) => {
      console.log('Admin role was NOT granted');

      console.log(err);
    },
  });
}

declineRequest(username: string) {
  this.loginService.declineAdminRole(username)
  .subscribe({
    next: () => {
      console.log('Admin role was declined');
    },
    error: (err) => {
      console.log('Admin role was NOT declined');

      console.log(err);
    },
  });
}

revokeAdmin(username: string){
  this.loginService.revokeAdminRole(username)
  .subscribe({
    next: () => {
      console.log('Revoked admin role of' + username);
    },
    error: (err) => {
      console.log('Revoked admin role failed');

      console.log(err);
    },
  });
}


deleteCard(cardName: string){
  this.cardService.deleteCard(cardName)
  .subscribe({
    next: () => {
      console.log('Revoked admin role of' + cardName);
    },
    error: (err) => {
      console.log('Revoked admin role failed');

      console.log(err);
    },
  });
}

showAddCardWindow(){
  this.showAddCard = true;
}


onFileSelected(event: any) {
  const file: File = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64String = reader.result as string;
    const base64WithoutPrefix = base64String.replace(/^data:image\/(png|jpg);base64,/, '')
                                              .replace(/^data:image\/png;base64,/, '')
                                              .replace(/^data:image\/jpg;base64,/, '');
    this.cardImageBase64 = base64WithoutPrefix;
  };
}



onSubmitAddCardForm(){
  // const formData = new FormData();
  // if (this.addNewCard.controls.cardName.value !== null) {
  //   formData.append('cardName', this.addNewCard.controls.cardName.value);
  //   console.log()
  // }
  // if (this.addNewCard.controls.cardPower.value !== null) {
  //   formData.append('cardPower', this.addNewCard.controls.cardPower.value);
  // }
  // if (this.addNewCard.controls.cardType.value !== null) {
  //   formData.append('cardType', this.addNewCard.controls.cardType.value);
  // }
  // const picture = this.addNewCard.controls.picture.value;
  // if (picture !== null) {
  //   formData.append('picture', picture);
  // } 


    if (this.addNewCard.valid) {
      const card: Card = {
        name: this.addNewCard.get('cardName')!.value || '',
        power: Number(this.addNewCard.get('cardPower')!.value),
        type: this.addNewCard.get('cardType')!.value || '',
        picture: this.cardImageBase64
      };

      console.log(card.name + " cardname");
      console.log(card.power + " pwoer");

      console.log(card.type + " type");

      console.log(card.picture + " picture");


      this.cardService.createCard(card)
  .subscribe({
    next: () => {
      console.log('Card created' + card);
    },
    error: (err) => {
      console.log('Card NOT CREATED');

      console.log(err);
    },
  });
}
}
}
