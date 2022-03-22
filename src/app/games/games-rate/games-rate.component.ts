import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameRating } from '../gameRating.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameRatingService } from '../gameRating.service';
import { AppUserInfoService } from 'src/app/users/appUserInfo.service';
import { AppUserInfo } from 'src/app/users/appUserInfo.model';

@Component({
  selector: 'app-games-rate',
  templateUrl: './games-rate.component.html',
  styleUrls: ['./games-rate.component.css'],
})
export class GamesRateComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  unratedGames: Game[] = [];
  currentGame: Game | null = null;
  index: number = 0;

  currentUser: firebase.User | null = null;

  private unratedGamesSub: Subscription;
  private userSub: Subscription;

  rateGameForm: FormGroup = new FormGroup({
    willingness: new FormControl('', [Validators.required]),
    watch: new FormControl(false),
  });

  constructor(
    private gameService: GameService,
    private gameRatingService: GameRatingService,
    private userService: AppUserInfoService,
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.isLoading = true;

    this.unratedGamesSub = this.gameService.unratedGames.subscribe((ug) => {
      this.unratedGames = ug;

      if (this.unratedGames.length == 0) {
        this.currentGame = null;
      } else if (!this.currentGame) {
        this.index = 0;
        this.currentGame = this.unratedGames[0];
      } else {
        if (this.index < this.unratedGames.length) {
          this.currentGame = this.unratedGames[this.index];
        } else {
          this.index = 0;
          this.currentGame = this.unratedGames[0];
        }
      }

      this.isLoading = false;
    });

    this.userSub = this.auth.user.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {}

  getNextGame() {
    this.rateGameForm.reset();

    if (this.unratedGames.length == 0) {
      this.currentGame = null;
      return;
    }

    if (this.unratedGames.length > this.index + 1) {
      this.index++;
    } else {
      this.index = 0;
    }
    this.currentGame = this.unratedGames[this.index];
  }

  async rateGame() {
    if (!this.rateGameForm.valid || !this.currentGame || !this.currentUser) {
      return;
    }

    if (!this.currentGame.id) {
      return;
    }

    this.isLoading = true;

    let userInfo;
    try {
      const userSnapshot = await this.userService
        .getUserInfo(this.currentUser.uid)
        .toPromise();

      userInfo = userSnapshot.data();
    } catch (error) {
      this.snackBar.open(
        'Error retreiving user data, please try again later.',
        'Dismiss',
        { duration: 5000 }
      );
      return;
    }

    if (userInfo == undefined) {
      this.snackBar.open(
        'Error retreiving user data, please try again later.',
        'Dismiss',
        { duration: 5000 }
      );
      return;
    }

    const willingness = this.rateGameForm.get('willingness')?.value;

    let favorValue = this.gameService.calculateFavorValue(willingness);
    let blueMoonValue = this.gameService.calculateFavorValue(willingness, true);

    const updatedGame: Partial<Game> = {
      numRatings: this.currentGame.numRatings + 1,
      usersRated: [...this.currentGame.usersRated, this.currentUser.uid],
      favorability: this.currentGame.favorability + favorValue,
      blueMoonFavorability:
        this.currentGame.blueMoonFavorability + blueMoonValue,
    };

    const updatedUserInfo: Partial<AppUserInfo> = {
      numRatings: userInfo.numRatings + 1,
      willingness: userInfo.willingness + favorValue,
    };

    const newRating: GameRating = {
      user: this.currentUser.uid,
      game: this.currentGame.id,
      rating: this.rateGameForm.get('willingness')?.value,
      watch: this.rateGameForm.get('watch')?.value,
    };

    try {
      // necessary because the async handling of updating the current game can happen
      // before we finish the promise.all
      const gameName = this.currentGame.name;

      const promises: Promise<any>[] = [];
      promises.push(
        this.gameRatingService.gameRatingsCollection.add(newRating)
      );
      promises.push(
        this.gameService.updateGame(this.currentGame.id, updatedGame)
      );
      promises.push(
        this.userService.updateUserInfo(this.currentUser.uid, updatedUserInfo)
      );

      await Promise.all(promises);

      this.snackBar.open(`Successfully rated ${gameName}!`, 'Dismiss', {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open(
        `Could not submit your rating. Please try again later.`,
        'Dismiss',
        { duration: 5000 }
      );

      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unratedGamesSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
