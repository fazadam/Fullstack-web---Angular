import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceAuthService } from '../login-service-auth.service';
import { User } from '../user';


@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  errorMessage: string = '';
  isAdmin!: boolean;

  ngOnInit(): void {

  }
  constructor(private router: Router, private loginAuthService: LoginServiceAuthService) { }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  onSubmit() {

    const user: any  = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }

    if (this.loginForm.valid) {
      this.loginAuthService.login(user)
        .subscribe({
          next: (data) => {
            localStorage.setItem('loggedInUser', user.username);
            console.log(localStorage.getItem('loggedInUser'));
            this.router.navigate(['/home']);


            this.loginAuthService.isAdmin().subscribe(result => {
              this.isAdmin = result;
              console.log("login  admin role: " + this.isAdmin);
              if(this.isAdmin){
                localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
                console.log("this admin role:" + this.isAdmin);
              }
  
            });
       


          },
          error: (error) => {
            console.log(this.errorMessage);
            this.errorMessage = error.error;
          }
        })
    }
  }
}

