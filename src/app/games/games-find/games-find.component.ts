import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/helpers/snackBar.service';
import { AppUserInfo } from 'src/app/users/appUserInfo.model';
import { AppUserInfoService } from 'src/app/users/appUserInfo.service';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import { GameRatingService } from '../gameRating.service';

@Component({
  selector: 'app-games-find',
  templateUrl: './games-find.component.html',
  styleUrls: ['./games-find.component.css'],
})
export class GamesFindComponent implements OnInit {
  users: AppUserInfo[] = [];
  checkedUserIds: string[] = [];

  isLoading: boolean = true;
  isLoadingGames: boolean = true;
  finished: boolean = false;

  calculatedRatings: Map<string, number> = new Map<string, number>();
  games: Game[] = [];

  displayedColumns: string[] = ['name', 'price', 'platform', 'favorability'];
  maxFavorValue = 0;
  minFavorValue = 0;

  constructor(
    private appUserInfoService: AppUserInfoService,
    private gameRatingService: GameRatingService,
    private gameService: GameService,
    private snackBarService: SnackBarService
  ) {
    this.appUserInfoService.allUserInfo.subscribe((allUserInfo) => {
      this.users = allUserInfo;
      this.isLoading = false;
    });

    this.gameService.allGames.subscribe((newGames) => {
      this.games = newGames;
      this.isLoadingGames = false;
    });
  }

  ngOnInit(): void {}

  toggleUser(checked: boolean, user: AppUserInfo) {
    if (checked) {
      this.checkedUserIds.push(user.uid);
    } else {
      this.checkedUserIds = this.checkedUserIds.filter((u) => u != user.uid);
    }
  }

  findGames() {
    if (this.checkedUserIds.length > 10) {
      this.snackBarService.open(
        "Sorry, only up to 10 users can be searched for at a time. This is due to a Firebase limitation. I'll implement a work around soon :)",
        12000
      );
      return;
    }

    this.isLoading = true;

    const ratingSub = this.gameRatingService
      .getRatings(this.checkedUserIds)
      .subscribe(
        (ratings) => {
          ratings.forEach((rating) => {
            const ratingData = rating.data();

            let favorability = this.calculatedRatings.get(ratingData.game);
            const favorValue = this.gameService.calculateFavorValue(
              ratingData.rating
            );

            if (favorability != undefined) {
              favorability += favorValue;
            } else {
              favorability = favorValue;
            }

            this.calculatedRatings.set(ratingData.game, favorability);
          });

          this.games.forEach((game) => {
            if (!game.id) return;

            const rating = this.calculatedRatings.get(game.id);

            if (rating == undefined) {
              game.favorability = 0;
            } else {
              game.favorability = rating;
            }
          });

          this.games.sort(this.gameService.favorSort);

          this.maxFavorValue = this.games[0].favorability;
          this.minFavorValue = this.games[this.games.length - 1].favorability;

          this.finished = true;
          this.isLoading = false;
        },
        (error) => {
          this.snackBarService.open(
            'Error communicating with server. Please try again later.'
          );
          this.isLoading = false;
        },
        () => {
          ratingSub.unsubscribe();
        }
      );
  }
}
