import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users/user.model';

const FAKE_USER_LIST: User[] = [
  {
    name: 'John Smith',
    willingness: 10,
  },
  {
    name: 'Deborah Jones',
    willingness: 15,
  },
  {
    name: 'Anime Liker',
    willingness: 99,
  },
  {
    name: 'Person with a really long name',
    willingness: 1,
  },
  {
    name: 'Another Guy',
    willingness: 10,
  },
];

@Component({
  selector: 'app-games-find',
  templateUrl: './games-find.component.html',
  styleUrls: ['./games-find.component.css'],
})
export class GamesFindComponent implements OnInit {
  users: User[] = FAKE_USER_LIST;

  constructor() {}

  ngOnInit(): void {}
}
