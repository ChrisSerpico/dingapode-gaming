import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-games-rate',
  templateUrl: './games-rate.component.html',
  styleUrls: ['./games-rate.component.css'],
})
export class GamesRateComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  unratedGames: Game[] = [];
  currentGame: Game | null = null;
  index: number = 0;

  private unratedGamesSub: Subscription;

  rateGameForm: FormGroup = new FormGroup({
    willingness: new FormControl('', [Validators.required]),
    watch: new FormControl(false),
  });

  constructor(private gameService: GameService) {
    this.isLoading = true;

    this.unratedGamesSub = this.gameService.unratedGames.subscribe((ug) => {
      this.unratedGames = ug;

      if (!this.currentGame && this.unratedGames.length > 0) {
        this.index = 0;
        this.currentGame = this.unratedGames[0];
      } else {
        this.currentGame = null;
      }

      this.isLoading = false;
    });
  }

  ngOnInit(): void {}

  getNextGame() {
    this.rateGameForm.reset();

    if (this.unratedGames.length == 0) {
      this.currentGame = null;
      return;
    }

    if (this.unratedGames.length > this.index + 1) {
      this.index++;
    } else {
      this.index = 0;
    }
    this.currentGame = this.unratedGames[this.index];
  }

  rateGame() {
    if (!this.rateGameForm.valid) {
      return;
    }

    console.log(this.rateGameForm.value);
  }

  ngOnDestroy(): void {
    this.unratedGamesSub.unsubscribe();
  }
}
