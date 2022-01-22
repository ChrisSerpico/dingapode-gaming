import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Game } from '../game.model';

@Component({
  selector: 'app-games-add',
  templateUrl: './games-add.component.html',
  styleUrls: ['./games-add.component.css'],
})
export class GamesAddComponent implements OnInit {
  addGameForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    price: new FormControl(0),
    platform: new FormControl(''),
  });
  isLoading: boolean = false;

  private gameCollection: AngularFirestoreCollection<Game>;

  constructor(
    private store: AngularFirestore,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.gameCollection = store.collection<Game>('games');
  }

  ngOnInit(): void {}

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
      numRatings: 0,
    };

    this.gameCollection
      .add(newGame)
      .then(() => {
        this.isLoading = false; // probably redundant
        this.snackBar.open(
          `Successfully added ${newGame.name} to the games list!`,
          'Dismiss',
          { duration: 5000 }
        );
        this.router.navigate(['/']);
      })
      .catch(() => {
        this.isLoading = false;
        this.snackBar.open(
          `Failed to add ${newGame.name} to the games list. Please try again later.`,
          'Dismiss',
          { duration: 5000 }
        );
      });
  }
}
