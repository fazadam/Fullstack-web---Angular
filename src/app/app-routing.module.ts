import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignupComponentComponent } from './signup-component/signup-component.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CardListComponentComponent } from './card-list-component/card-list-component.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { GameComponentComponent } from './game-component/game-component.component';
import { VideoComponentComponent } from './video-component/video-component.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch:'full'},
  {path: 'login',component: LoginComponentComponent},
  {path:'signup',component:SignupComponentComponent},
  {path: 'home', component:HomePageComponent},
  {path: 'cards', component:CardListComponentComponent},
  {path: 'profile',component: UserprofileComponent},
  {path: 'game',component: GameComponentComponent},
  {path: 'videos', component: VideoComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const rountingComponents=[LoginComponentComponent,SignupComponentComponent,CardListComponentComponent,UserprofileComponent,GameComponentComponent,VideoComponentComponent]
