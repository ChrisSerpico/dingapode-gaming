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

  public getRatings(userIds: string[]) {
    return this.store
      .collection<GameRating>('gameRatings', (ref) =>
        ref.where('user', 'in', userIds)
      )
      .valueChanges({ idField: 'id' });
  }

  public getRatingsForUser(userId: string) {
    return this.getRatings([userId]);
  }
}
