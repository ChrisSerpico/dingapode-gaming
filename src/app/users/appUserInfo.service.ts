import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { AppUserInfo } from './appUserInfo.model';

@Injectable({ providedIn: 'root' })
export class AppUserInfoService {
  public allUserInfo: Observable<AppUserInfo[]>;

  public appUserInfoCollection: AngularFirestoreCollection<AppUserInfo>;

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {
    this.appUserInfoCollection =
      this.store.collection<AppUserInfo>('appUserInfos');
    this.allUserInfo = this.appUserInfoCollection.valueChanges({
      idField: 'id',
    });
  }

  public createUserInfoIfNecessary(newUser: firebase.User) {
    const userInfoDoc = this.appUserInfoCollection.doc(newUser.uid);

    const userInfoDocSub = userInfoDoc.get().subscribe(
      (infoDoc) => {
        if (infoDoc.exists) {
          return;
        }

        userInfoDoc.set({
          name: newUser.displayName ? newUser.displayName : 'Unnamed User',
          willingness: 0,
          uid: newUser.uid,
          numRatings: 0,
        });
      },
      (error) => {},
      () => {
        userInfoDocSub.unsubscribe();
      }
    );
  }
}
