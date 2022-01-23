import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

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

  constructor(public gameService: GameService) {}

  ngOnInit(): void {}
}
