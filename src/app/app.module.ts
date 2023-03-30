import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignupComponentComponent } from './signup-component/signup-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { CardListComponentComponent } from './card-list-component/card-list-component.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { GameComponentComponent } from './game-component/game-component.component';
import { VideoComponentComponent } from './video-component/video-component.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    SignupComponentComponent,
    HomePageComponent,
    CardListComponentComponent,
    UserprofileComponent,
    GameComponentComponent,
    VideoComponentComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
