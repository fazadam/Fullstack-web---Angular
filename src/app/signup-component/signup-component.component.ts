import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { SignupServiceService } from '../signup-service.service';

@Component({
  selector: 'app-signup-component',
  templateUrl: './signup-component.component.html',
  styleUrls: ['./signup-component.component.css']
})
export class SignupComponentComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private signupService: SignupServiceService, private router: Router) { }
  errorMessage: string = '';

  ngOnInit(): void {
  }

  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/)]),
    email: new FormControl('', [Validators.required, Validators.email])

  });

  onSubmit() {

    const user: any = {
      username: this.registrationForm.get('username')?.value,
      email: this.registrationForm.get('email')?.value,
      password: this.registrationForm.get('password')?.value
    }

    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);

      this.signupService.registerUser(user)
        .subscribe({
          next: (data) => {
            this.router.navigate(['/login']);
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
