import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from 'src/app/games/game.model';
import { GameService } from 'src/app/games/game.service';
import { GameRatingService } from 'src/app/games/gameRating.service';
import { SnackBarService } from 'src/app/helpers/snackBar.service';
import { AppUserInfo } from '../appUserInfo.model';
import { AppUserInfoService } from '../appUserInfo.service';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css'],
})
export class UsersViewComponent implements OnInit, OnDestroy {
  userInfo?: AppUserInfo;
  private userInfoSub?: Subscription;

  gameList: Game[] = [];
  loadingGameList: boolean = true;
  private gamesSub?: Subscription;

  displayedColumns = ['name', 'favorability'];

  constructor(
    private route: ActivatedRoute,
    private appUserService: AppUserInfoService,
    private gameService: GameService,
    private gameRatingService: GameRatingService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');

    if (userId == null) {
      this.snackBarService.open("Couldn't find user with that ID");
      this.router.navigate(['users/list']);
      return;
    }

    this.userInfoSub = this.appUserService
      .getUserInfo(userId)
      .subscribe((userInfo) => {
        this.userInfo = userInfo.data();
      });

    this.gamesSub = combineLatest([
      this.gameRatingService.getRatingsForUser(userId),
      this.gameService.getGamesRatedByUser(userId),
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

          return games;
        }),
        map((unsortedGames) => unsortedGames.sort(this.gameService.favorSort))
      )
      .subscribe((gameList) => {
        this.gameList = gameList;
        this.loadingGameList = false;
      });
  }

  ngOnDestroy(): void {
    if (this.userInfoSub) {
      this.userInfoSub.unsubscribe();
    }

    if (this.gamesSub) {
      this.gamesSub.unsubscribe();
    }
  }
}
