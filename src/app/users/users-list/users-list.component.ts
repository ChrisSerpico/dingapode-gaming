import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUserInfo } from '../appUserInfo.model';
import { AppUserInfoService } from '../appUserInfo.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;

  currentUsers: AppUserInfo[] = [];
  private userSub: Subscription;

  displayedColumns = ['name', 'ratings'];

  constructor(private appUserService: AppUserInfoService) {
    this.userSub = this.appUserService.allUserInfo.subscribe((allUsers) => {
      this.currentUsers = allUsers;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
