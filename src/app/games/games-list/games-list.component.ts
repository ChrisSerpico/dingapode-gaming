import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import chroma from 'chroma-js';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'price',
    'platform',
    'ratings',
    'favorability',
  ];

  public sortedGames: Observable<Game[]>;

  public maxFavorValue = 0;
  public minFavorValue = 0;

  private colorScale: any;

  constructor(public gameService: GameService) {
    this.sortedGames = gameService.allGames.pipe(
      map((unsortedGames) => unsortedGames.sort(this.favorSort))
    );
  }

  ngOnInit(): void {
    this.sortedGames.subscribe((newGameList) => {
      if (newGameList.length == 0) {
        return;
      }

      this.maxFavorValue = newGameList[0].favorability;
      this.minFavorValue = newGameList[newGameList.length - 1].favorability;
    });

    this.colorScale = chroma.scale([
      'ff0000',
      'ffa700',
      'fff400',
      'a3ff00',
      '2cba00',
    ]);
  }

  getGradientColor(gameFavorability: number) {
    const ratio =
      (gameFavorability - this.minFavorValue) /
      (this.maxFavorValue - this.minFavorValue);
    const hex = this.colorScale(ratio).hex();

    return { color: hex };
  }

  private favorSort(a: Game, b: Game) {
    if (a.favorability > b.favorability) {
      return -1;
    }
    if (a.favorability < b.favorability) {
      return 1;
    }
    return 0;
  }
}
