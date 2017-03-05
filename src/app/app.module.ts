import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { LobbyComponent } from './components/game/lobby/lobby.component';
import { GameBoardComponent } from './components/game/game-board/game-board.component';
import { HomeComponent } from './components/game/home/home.component';
import { AboutComponent } from './components/about/about/about.component';
import { RulesComponent } from './components/rules/rules/rules.component';
import { MultiGameBoardComponent } from './components/game/multi-game-board/multi-game-board.component';

import { SocketProxyService } from './services/socket-proxy.service';
import { UtilsService } from './services/utils.service';

const appRoutes: Routes = [
  { path: 'game', component: HomeComponent }, 
  { path: 'about', component: AboutComponent }, 
  { path: 'rules', component: RulesComponent },
  { path: '',   redirectTo: '/game', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    HomeComponent,
    LobbyComponent,
    AboutComponent,
    RulesComponent,
    MultiGameBoardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    SocketProxyService, 
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
