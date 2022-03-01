import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';
import { GameService } from './games/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'dingapode-gaming';

  numToRate: number = 0;
  private unratedGamesSub?: Subscription;
  private userAuthSub: Subscription;

  constructor(public auth: AngularFireAuth, public gameService: GameService) {
    this.userAuthSub = auth.user.subscribe((userInfo) => {
      if (userInfo) {
        // logged in
        this.unratedGamesSub = this.gameService.unratedGames.subscribe(
          (unratedGames) => {
            this.numToRate = unratedGames.length;
          }
        );
      }
    });
  }

  logIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    this.auth.signInWithPopup(provider);
  }

  logOut() {
    this.unsubscribeUnratedGames();
    this.auth.signOut();
  }

  ngOnDestroy(): void {
    this.unsubscribeUnratedGames();
    this.userAuthSub.unsubscribe();
  }

  private unsubscribeUnratedGames() {
    if (this.unratedGamesSub) {
      this.unratedGamesSub.unsubscribe();
    }
  }
}
