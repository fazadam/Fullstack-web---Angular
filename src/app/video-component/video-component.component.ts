import { Component } from '@angular/core';
import { LoginServiceAuthService } from '../login-service-auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.css']
})
export class VideoComponentComponent {

isLoggedIn: boolean = localStorage.getItem('loggedInUser') ? true : false;

  errorMsg = '';
  showOnlyFavoritesBool = false;
  favoriteVideos!: string[];
  isFavorite = false;

  constructor(private loginSerivce: LoginServiceAuthService, private sanitizer: DomSanitizer
  ) { }



  showOnlyFavorites() {
    this.showOnlyFavoritesBool = !this.showOnlyFavoritesBool;
    this.loginSerivce.getFavouriteVideos(localStorage.getItem('loggedInUser') ?? '')
      .subscribe(favoriteVideos => {
        this.favoriteVideos = favoriteVideos;
        console.log('favorit videos:' + favoriteVideos);
      })
  }

  getVideoUrl(favorite: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(favorite);
  }


  addToFavorites(url: string) {
    
    this.loginSerivce.setFavouriteVideos(localStorage.getItem('loggedInUser') ?? '', url)
      .subscribe({
        next: (data) => {
          console.log('sikeresen hozzadva' + url)
        },
        error: (error) => {
          this.errorMsg = error.error;
        }
      })
  }


  removeFromFavoritVideos(url: string) {
    this.loginSerivce.deleteFavouriteVideos(localStorage.getItem('loggedInUser') ?? '', url)
      .subscribe({
        next: (data) => {
          console.log('sikeresen torole' + url)
        },
        error: (error) => {
          this.errorMsg = error.error;
        }
      })
  }
}
