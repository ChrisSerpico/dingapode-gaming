import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesAddComponent } from './games/games-add/games-add.component';
import { GamesFindComponent } from './games/games-find/games-find.component';
import { GamesListComponent } from './games/games-list/games-list.component';
import { GamesRateComponent } from './games/games-rate/games-rate.component';
import { UsersListComponent } from './users/users-list/users-list.component';

const routes: Routes = [
  { path: '', component: GamesListComponent },
  { path: 'games/add', component: GamesAddComponent },
  { path: 'games/rate', component: GamesRateComponent },
  { path: 'games/find', component: GamesFindComponent },
  { path: 'users/list', component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
