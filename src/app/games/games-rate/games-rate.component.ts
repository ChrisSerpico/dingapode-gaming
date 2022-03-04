import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import firebase from 'firebase/compat/app';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { GameRating } from '../gameRating.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameRatingService } from '../gameRating.service';

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

    const gameDoc = this.store.doc<Game>(`games/${this.currentGame.id}`);

    let favorValue = 0;
    let blueMoonValue = 0;

    switch (this.rateGameForm.get('willingness')?.value) {
      case 'love':
        favorValue = 3;
        blueMoonValue = 3;
        break;
      case 'like':
        favorValue = 2;
        blueMoonValue = 2;
        break;
      case 'okay':
        favorValue = 1;
        blueMoonValue = 3;
        break;
      case 'hate':
        favorValue = -1;
        blueMoonValue = -1;
        break;
    }

    const updatedGame: Partial<Game> = {
      numRatings: this.currentGame.numRatings + 1,
      usersRated: [...this.currentGame.usersRated, this.currentUser.uid],
      favorability: this.currentGame.favorability + favorValue,
      blueMoonFavorability:
        this.currentGame.blueMoonFavorability + blueMoonValue,
    };

    const newRating: GameRating = {
      user: this.currentUser.uid,
      game: this.currentGame.id,
      rating: this.rateGameForm.get('willingness')?.value,
      watch: this.rateGameForm.get('watch')?.value,
    };

    this.gameRatingService.gameRatingsCollection
      .add(newRating)
      .then(() => {
        gameDoc.update(updatedGame);
        this.snackBar.open(
          `Successfully rated ${this.currentGame?.name}!`,
          'Dismiss',
          { duration: 5000 }
        );
      })
      .catch(() => {
        this.snackBar.open(
          `Could not submit your rating. Please try again later.`,
          'Dismiss',
          { duration: 5000 }
        );

        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.unratedGamesSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
