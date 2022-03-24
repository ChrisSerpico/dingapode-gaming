import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/helpers/snackbar.service';
import { Game } from '../game.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-games-add',
  templateUrl: './games-add.component.html',
  styleUrls: ['./games-add.component.css'],
})
export class GamesAddComponent {
  addGameForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    price: new FormControl(0),
    platform: new FormControl(''),
  });
  isLoading: boolean = false;

  constructor(
    private gameService: GameService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  addGame() {
    if (!this.addGameForm.valid) {
      return;
    }

    this.isLoading = true;

    if (
      !this.addGameForm.get('price') ||
      !(typeof this.addGameForm.get('price')?.value == 'number') ||
      this.addGameForm.get('price')?.value < 0
    ) {
      this.addGameForm.patchValue({ price: 0 });
    }

    const newGame: Game = {
      name: this.addGameForm.get('title')?.value.trim(),
      price: this.addGameForm.get('price')?.value,
      platform: this.addGameForm.get('platform')?.value,
      favorability: 0,
      blueMoonFavorability: 0,
      numRatings: 0,
      usersRated: [],
    };

    this.gameService.gamesCollection
      .add(newGame)
      .then(() => {
        this.isLoading = false; // probably redundant
        this.snackBarService.open(
          `Successfully added ${newGame.name} to the games list!`
        );
        this.router.navigate(['/']);
      })
      .catch(() => {
        this.isLoading = false;
        this.snackBarService.open(
          `Failed to add ${newGame.name} to the games list. Please try again later.`
        );
      });
  }
}
