import { Component, OnInit } from '@angular/core';
import { Game } from '../game.model';

const FAKE_GAME_DATA: Game[] = [
  {
    name: 'League of Legends',
    price: 0,
    platform: 'Download',
    favorability: 97,
    numRatings: 15,
  },
  {
    name: 'Runescape',
    price: 0,
    platform: 'Download',
    favorability: 63,
    numRatings: 8,
  },
  {
    name: 'Back 4 Blood',
    platform: 'Steam',
    price: 59.99,
    favorability: 55,
    numRatings: 6,
  },
];

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit {
  dataSource: Game[] = FAKE_GAME_DATA;
  displayedColumns: string[] = [
    'name',
    'price',
    'platform',
    'ratings',
    'favorability',
  ];

  constructor() {}

  ngOnInit(): void {}
}
