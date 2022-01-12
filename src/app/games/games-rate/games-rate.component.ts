import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Game } from '../game.model';

const FAKE_GAME: Game = {
  name: 'League of Legends',
  price: 0,
  platform: 'Download',
  numRatings: 5,
  favorability: 20,
};

@Component({
  selector: 'app-games-rate',
  templateUrl: './games-rate.component.html',
  styleUrls: ['./games-rate.component.css'],
})
export class GamesRateComponent implements OnInit {
  currentGame: Game = FAKE_GAME;

  rateGameForm: FormGroup = new FormGroup({
    willingness: new FormControl('', [Validators.required]),
    watch: new FormControl(false),
  });

  constructor() {}

  ngOnInit(): void {}

  rateGame() {
    if (!this.rateGameForm.valid) {
      return;
    }

    console.log(this.rateGameForm.value);
  }
}
