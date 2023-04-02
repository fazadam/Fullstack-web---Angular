import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginServiceAuthService } from './login-service-auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


constructor(private router:Router, private http: HttpClient, private loginService: LoginServiceAuthService){}

ngOnInit(): void {
  // this.loginService.isAdmin().subscribe(result => {
  //   this.isAdmin = result;
  //   console.log(this.isAdmin);

  // });
}



isAdmin(): boolean{
  return !!localStorage.getItem('isAdmin');
}

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

showAdmin(){
  this.router.navigate(['/admin']);
}

onLogout(){
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('isAdmin');
  

  console.log(localStorage.getItem('loggedInUser'));
  this.router.navigate(['/login']);
  // this.logoutEvent.emit();
}
}
