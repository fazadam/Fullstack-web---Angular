import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor(private router:Router, private http: HttpClient){}


isLoggedIn(): boolean {
  return !!localStorage.getItem('loggedInUser');
}


showProfile(){
  this.router.navigate(['/profile']);
  console.log(localStorage.getItem('loggedInUser'));

}

showLogin(){
  this.router.navigate(['/login']);
  console.log(localStorage.getItem('loggedInUser'));

}

showSignup(){
  this.router.navigate(['/signup'])
  console.log(localStorage.getItem('loggedInUser'));

}

showCards(){
  this.router.navigate(['/cards'])
  console.log(localStorage.getItem('loggedInUser'));

}

showGame(){
  this.router.navigate(['/game']);
  console.log(localStorage.getItem('loggedInUser'));

}

onLogout(){
  localStorage.removeItem('loggedInUser');
  console.log(localStorage.getItem('loggedInUser'));
  this.router.navigate(['/login'])
}
}
