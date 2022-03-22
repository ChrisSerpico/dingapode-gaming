import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from './game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public allGames: Observable<Game[]>;
  public unratedGames: Observable<Game[]>;

  public gamesCollection: AngularFirestoreCollection<Game>;

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

  public getGame(id: string) {
    return this.gamesCollection.doc(id).get();
  }

  public updateGame(id: string, data: Partial<Game>) {
    return this.gamesCollection.doc(id).update(data);
  }

  public calculateFavorValue(
    willingness: string,
    blueMoon: boolean = false
  ): number {
    switch (willingness) {
      case 'love':
        return 3;
      case 'like':
        return 2;
      case 'okay':
        if (blueMoon) return 3;
        else return 1;
      case 'hate':
        return -1;
      default:
        return 0;
    }
  }

  public favorSort(a: Game, b: Game) {
    if (a.favorability > b.favorability) {
      return -1;
    }
    if (a.favorability < b.favorability) {
      return 1;
    }
    return 0;
  }
}
