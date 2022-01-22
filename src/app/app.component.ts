import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'dingapode-gaming';

  constructor(public auth: AngularFireAuth) {}

  logIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    this.auth.signInWithPopup(provider);
  }

  logOut() {
    this.auth.signOut();
  }
}
