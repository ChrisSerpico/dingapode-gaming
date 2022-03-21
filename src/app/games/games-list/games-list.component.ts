import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;

  displayedColumns: string[] = [
    'name',
    'price',
    'platform',
    'ratings',
    'favorability',
  ];

  private sortedGames: Observable<Game[]>;
  private sortedGamesSub?: Subscription;
  gamesList: Game[] = [];

  maxFavorValue = 0;
  minFavorValue = 0;

  constructor(public gameService: GameService) {
    this.sortedGames = gameService.allGames.pipe(
      map((unsortedGames) => unsortedGames.sort(this.gameService.favorSort))
    );
  }

  ngOnInit(): void {
    this.sortedGamesSub = this.sortedGames.subscribe((newGameList) => {
      this.gamesList = newGameList;
      this.isLoading = false;

      if (newGameList.length == 0) {
        return;
      }

      this.maxFavorValue = newGameList[0].favorability;
      this.minFavorValue = newGameList[newGameList.length - 1].favorability;
    });
  }

  ngOnDestroy(): void {
    this.sortedGamesSub?.unsubscribe();
  }
}
