import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginServiceAuthService } from '../login-service-auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Observable, Subscription } from 'rxjs';
import { Role } from '../role';
import { User } from '../user';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  errorMessage: string = '';
  roles!: string[];
  isAdmin!: boolean;
  requestedAdminRole: boolean = false;

  constructor(private loginService: LoginServiceAuthService, private formbuilder: FormBuilder, private router: Router, private appComponent: AppComponent) {
  }



  userForm = this.formbuilder.group({
    username: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]),
    password: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/)]),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email])
  });





  ngOnInit(): void {


    this.loginService.isAdmin().subscribe(result => {
      this.isAdmin = result;
      console.log(this.isAdmin);

    });

    this.loginService.getUser(localStorage.getItem('loggedInUser')).subscribe({
      next: (response) => {
        this.userForm.get('username')?.setValue(response.username);
        this.userForm.get('password')?.setValue(response.password);
        this.userForm.get('email')?.setValue(response.email);

      },
      error: (err) => {
        console.log(err);
      },
    });


    this.loginService.getRoles(localStorage.getItem('loggedInUser') ?? '').subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        // Handle the error
      }

    );
  }


  showUpdateForm() {
    this.userForm.enable();
  }


  onUpdateUserProfile() {

    // const usernameChanged = this.userForm.get('username')?.dirty && !this.userForm.get('username')?.hasError('required');
    // const emailChanged = this.userForm.get('email')?.dirty && !this.userForm.get('email')?.hasError('required') && !this.userForm.get('email')?.hasError('email');
    // const passwordChanged = this.userForm.get('password')?.dirty && !this.userForm.get('password')?.hasError('required') && !this.userForm.get('password')?.hasError('minlength') && !this.userForm.get('password')?.hasError('pattern');

    console.log("submitted");
    console.log(this.userForm.valid);
    console.log(this.userForm.get('username')?.dirty);
    console.log("password is dirty?" + this.userForm.get('password')?.dirty);




    if (this.userForm.valid) {


      const user = {
        username: this.userForm.get('username')!.value || '',
        email: this.userForm.get('email')!.value || '',
        password: this.userForm.get('password')!.value || '',
      }
      if (this.userForm.get('email')?.dirty) {
        this.loginService.updateProfileEmail(localStorage.getItem('loggedInUser') ?? '', user.email)
          .subscribe({
            next: (data) => {

              console.log(' email sub belseje')
              // console.log("user updated: " + data);
              // localStorage.setItem('loggedInUser', user.username);
              // console.log(localStorage.getItem('loggedInUser'));

            },
            error: (error) => {
              console.log('email error belseje:');
              console.log(this.errorMessage);
              this.errorMessage = error.error;
            }
          });
      }

      if (this.userForm.get('password')?.dirty) {
        this.loginService.updateProfilePassword(localStorage.getItem('loggedInUser') ?? '', user.password)
          .subscribe({
            next: (data) => {
              //localStorage.setItem('loggedInUser', user.username);

              // this.loginService.login(user)
              //   .subscribe({next: (data) => {
              //     localStorage.setItem('loggedInUser', user.username);
              //     console.log(localStorage.getItem('loggedInUser'));
              //   },
              // error: error => console.log(error)
              // });
            },
            error: (error) => {
              console.log('password error belseje:');
              console.log(this.errorMessage);
              this.errorMessage = error.error;
            }
          });
      }

      if (this.userForm.get('username')?.dirty) {
        this.loginService.updateProfileUsername(localStorage.getItem('loggedInUser') ?? '', user.username)
          .subscribe({
            next: (data) => {

              localStorage.setItem('loggedInUser', user.username);


              // this.loginService.login(user)
              //   .subscribe({next: (data) => {
              //     localStorage.setItem('loggedInUser', user.username);
              //     console.log(localStorage.getItem('loggedInUser'));
              //   },
              // error: error => console.log(error)
              // });
            },
            error: (error) => {
              console.log('email error belseje:');
              console.log(this.errorMessage);
              this.errorMessage = error.error;
            }
          });
      }
      // this.appComponent.onLogout();
    }

    // this.loginService.updateProfile(localStorage.getItem('loggedInUser') ?? '', user)
    // .subscribe({
    //   next: (data) => {
    //     console.log("user updated: " + data);
    //     localStorage.setItem('loggedInUser', user.username);
    //     console.log(localStorage.getItem('loggedInUser'));


    //     // ujra authentikalas h ne kelljen ujra belepni
    //     this.loginService.login(user).subscribe({
    //       next: (data) => {
    //         localStorage.setItem('loggedInUser', user.username);
    //         console.log(localStorage.getItem('loggedInUser'));
    //       },
    //       error: error => console.log(error)
    //     });
    //   },
    //   error: error => console.log(error)
    // });
  }


  requestAdminRole() {
    if (!this.roles.includes("ROLE_ADMIN")) {
      this.loginService.setPendingAdminRequest(localStorage.getItem('loggedInUser') ?? '')
        .subscribe({
          next: () => {
            console.log('admin request sent');
            this.requestedAdminRole = true;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {

      this.errorMessage = "already has admin role";


    }
  }
}

