import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from 'src/app/games/game.model';
import { GameService } from 'src/app/games/game.service';
import { GameRatingService } from 'src/app/games/gameRating.service';
import { SnackBarService } from 'src/app/helpers/snackBar.service';
import { AppUserInfo } from '../appUserInfo.model';
import { AppUserInfoService } from '../appUserInfo.service';
import firebase from 'firebase/compat/app';

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
  loadingGameList: boolean = true;
  private gamesSub?: Subscription;

  displayedColumns = ['name', 'favorability'];

  isEditing: boolean = false;

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
    ])
      .pipe(
        map(([ratings, games]) => {
          games.forEach((game) => {
            const matchingRating = ratings.find(
              (rating) => rating.game == game.id
            );

            if (!matchingRating) {
              game.favorability = 0;
            } else {
              game.favorability = this.gameService.calculateFavorValue(
                matchingRating.rating
              );
            }
          });

          return games.sort(this.gameService.favorSort);
        })
      )
      .subscribe((gameList) => {
        this.gameList = gameList;
        this.loadingGameList = false;
      });

    this.userSub = this.auth.user.subscribe((newUser) => {
      this.currentUser = newUser;
    });
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
