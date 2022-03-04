import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { GameRating } from './gameRating.model';

@Injectable({ providedIn: 'root' })
export class GameRatingService {
  public gameRatingsCollection: AngularFirestoreCollection<GameRating>;

  constructor(private store: AngularFirestore) {
    this.gameRatingsCollection =
      this.store.collection<GameRating>('gameRatings');
  }
}
