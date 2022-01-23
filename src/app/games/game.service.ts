import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { combineLatest, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from './game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public allGames: Observable<Game[]>;
  public unratedGames: Observable<Game[]>;

  private gamesCollection: AngularFirestoreCollection<Game>;

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {
    this.gamesCollection = this.store.collection<Game>('games');
    this.allGames = this.gamesCollection.valueChanges({ idField: 'id' });

    this.unratedGames = combineLatest([this.allGames, this.auth.user]).pipe(
      map(([games, user]) => {
        if (!user) {
          return [];
        }

        return games.filter((game) => !game.usersRated.includes(user.uid));
      })
    );
  }
}
