import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() {}

  ngOnInit(): void {}

  addGame() {
    if (!this.addGameForm.valid) {
      return;
    }

    if (
      !this.addGameForm.get('price') ||
      !(typeof this.addGameForm.get('price')?.value == 'number') ||
      this.addGameForm.get('price')?.value < 0
    ) {
      this.addGameForm.patchValue({ price: 0 });
    }

    console.log(this.addGameForm.value);
  }
}
