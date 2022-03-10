import { Component, OnInit } from '@angular/core';
import { AppUserInfo } from 'src/app/users/appUserInfo.model';

@Component({
  selector: 'app-games-find',
  templateUrl: './games-find.component.html',
  styleUrls: ['./games-find.component.css'],
})
export class GamesFindComponent implements OnInit {
  users: AppUserInfo[] = [];

  constructor() {}

  ngOnInit(): void {}
}
