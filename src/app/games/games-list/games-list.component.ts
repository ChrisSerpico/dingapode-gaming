import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Game } from '../game.model';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit {
  private gamesCollection: AngularFirestoreCollection<Game>;
  dataSource: Observable<Game[]>;

  displayedColumns: string[] = [
    'name',
    'price',
    'platform',
    'ratings',
    'favorability',
  ];

  constructor(private store: AngularFirestore) {
    this.gamesCollection = store.collection<Game>('games');
    this.dataSource = this.gamesCollection.valueChanges();
  }

  ngOnInit(): void {}
}
