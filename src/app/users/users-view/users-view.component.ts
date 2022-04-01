import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { Game } from 'src/app/games/game.model';
import { GameService } from 'src/app/games/game.service';
import { GameRatingService } from 'src/app/games/gameRating.service';
import { SnackBarService } from 'src/app/helpers/snackBar.service';
import { AppUserInfo } from '../appUserInfo.model';
import { AppUserInfoService } from '../appUserInfo.service';
import firebase from 'firebase/compat/app';
import { GameRating } from 'src/app/games/gameRating.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css'],
})
export class UsersViewComponent implements OnInit, OnDestroy {
  userInfo?: AppUserInfo;
  userId: string | null = null;
  currentUser: firebase.User | null = null;
  private userInfoSub?: Subscription;
  private userSub?: Subscription;

  gameList: Game[] = [];
  originalFavorability: Map<string, number> = new Map();
  matchedRatings: Map<string, GameRating> = new Map();
  loadingGameList: boolean = true;
  private gamesSub?: Subscription;

  displayedColumns = ['name', 'favorability'];

  displayedEditColumns = ['name', 'favorability'];
  isEditing: boolean = false;
  isUpdatingEdits: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private appUserService: AppUserInfoService,
    private gameService: GameService,
    private gameRatingService: GameRatingService,
    private snackBarService: SnackBarService,
    private router: Router,
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');

    if (this.userId == null) {
      this.snackBarService.open("Couldn't find user with that ID");
      this.router.navigate(['users/list']);
      return;
    }

    this.userInfoSub = this.appUserService
      .getUserInfo(this.userId)
      .subscribe((userInfo) => {
        this.userInfo = userInfo.data();
      });

    this.gamesSub = combineLatest([
      this.gameRatingService.getRatingsForUser(this.userId),
      this.gameService.getGamesRatedByUser(this.userId),
    ]).subscribe(([ratings, games]) => {
      this.originalFavorability = new Map();
      this.matchedRatings = new Map();
      this.gameList = [];

      games.forEach((game) => {
        const newGame = { ...game };
        const matchingRating = ratings.find((rating) => rating.game == game.id);
        this.originalFavorability.set(game.id, game.favorability);

        if (!matchingRating) {
          newGame.favorability = 0;
        } else {
          newGame.favorability = this.gameService.calculateFavorValue(
            matchingRating.rating
          );
          this.matchedRatings.set(game.id, matchingRating);
        }

        this.gameList.push(newGame);
      });

      this.gameList = this.gameList.sort(this.gameService.favorSort);
      this.loadingGameList = false;
    });

    this.userSub = this.auth.user.subscribe((newUser) => {
      this.currentUser = newUser;
    });
  }

  async onChangeRating(
    event: MatSelectChange,
    originalRating: number,
    gameId: string
  ) {
    if (!this.userInfo || !this.userId) {
      return;
    }

    const newRating = event.value;

    if (newRating > 3 || newRating < -1 || newRating == originalRating) {
      return;
    }

    this.isUpdatingEdits = true;

    const game = this.gameList.find((g) => g.id == gameId);
    const originalFavorability = this.originalFavorability.get(gameId);
    const rating = this.matchedRatings.get(gameId);

    if (!game || !game.id || !rating || !rating.id || !originalFavorability) {
      this.isUpdatingEdits = false;
      return;
    }

    const gameUpdate = {
      favorability: originalFavorability - originalRating + newRating,
    };
    const ratingUpdate = {
      rating: this.gameService.getFavorString(newRating),
    };
    const userUpdate = {
      willingness: this.userInfo.willingness - originalRating + newRating,
    };

    const promises = [];

    promises.push(this.gameService.updateGame(game.id, gameUpdate));
    promises.push(this.gameRatingService.updateRating(rating.id, ratingUpdate));
    promises.push(this.appUserService.updateUserInfo(this.userId, userUpdate));

    try {
      await Promise.all(promises);
    } catch (error) {
      this.snackBarService.open(
        'Could not update your rating, please try again later'
      );
    }

    this.isUpdatingEdits = false;
  }

  isCurrentUser(): boolean {
    if (!this.currentUser || !this.userId) {
      return false;
    }

    if (this.currentUser.uid == this.userId) {
      return true;
    }

    return false;
  }

  canEdit(): boolean {
    if (this.loadingGameList) return false;
    if (!this.isCurrentUser()) return false;
    if (this.gameList.length == 0) return false;
    if (this.isEditing) return false;

    return true;
  }

  ngOnDestroy(): void {
    if (this.userInfoSub) {
      this.userInfoSub.unsubscribe();
    }

    if (this.gamesSub) {
      this.gamesSub.unsubscribe();
    }

    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
