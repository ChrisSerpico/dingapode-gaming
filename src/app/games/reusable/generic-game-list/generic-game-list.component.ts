import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../../game.model';
import chroma from 'chroma-js';

@Component({
  selector: 'app-generic-game-list',
  templateUrl: './generic-game-list.component.html',
  styleUrls: ['./generic-game-list.component.css'],
})
export class GenericGameListComponent implements OnInit {
  @Input()
  displayedColumns: string[] = [];

  @Input()
  public games: Game[] = [];

  @Input()
  public maxFavorValue = 0;
  @Input()
  public minFavorValue = 0;

  private colorScale: any;

  constructor() {}

  ngOnInit(): void {
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
}
