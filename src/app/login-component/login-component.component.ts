import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceAuthService } from '../login-service-auth.service';


@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  errorMessage: string = '';

  ngOnInit(): void {

  }
  constructor(private router: Router, private loginAuthService: LoginServiceAuthService) { }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })

  onSubmit() {

    const user: any = {
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
          },
          error: (error) => {
            console.log('email error belseje:');
            console.log(this.errorMessage);
            this.errorMessage = error.error;
          }
        })
    }
  }
}
