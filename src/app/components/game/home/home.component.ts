import { Component, OnInit } from '@angular/core';
import { LobbyComponent } from '../lobby/lobby.component';
import { GameBoardComponent } from '../game-board/game-board.component';
import { Player } from '../../../models/player';
import { Game, GameType, GameDifficulty, GameCard } from '../../../models/game';
import { SocketProxyService } from '../../../services/socket-proxy.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //Reference to types to be used in view
  GameType = GameType;
  GameDifficulty = GameDifficulty;

  player: Player;
  game: Game
  gameTypeKeys: string[];
  gameDifficultyKeys: string[];
  customCards: string[];

  isGameReady: boolean;

  errorText: string;

  totalPairs: number;
  roundLength: number;
  missesAllowed: number;

  constructor(private socketProxy: SocketProxyService) { }

  ngOnInit() {
    this.player = new Player();
    this.game = new Game();
    this.isGameReady = false;
    this.errorText = null;

    var objectKeys = Object.keys(GameType);
    this.gameTypeKeys = objectKeys.splice(objectKeys.length / 2);
    objectKeys = Object.keys(GameDifficulty);
    this.gameDifficultyKeys = objectKeys.splice(objectKeys.length / 2);

    this.socketProxy.connect();
    this.socketProxy.registerUsernameSet(this.setUsername);
    this.socketProxy.registerUsernameTaken(this.usernameTaken);
  }

  get isBtnDisabled(): boolean {
    return this.player.username.trim().length === 0;
  }

  updateGameType(gameType: string): void {
    this.game.type = GameType[gameType];
  }

  updateGameDifficulty(difficulty: string): void {
    this.game.difficulty = GameDifficulty[difficulty];
  }

  playGame(): void {
    if (this.player.username.trim().length < 1) {
      this.errorText = "Username cannot be empty";
      return;
    }

    if (this.game.type === GameType.SinglePlayer) {
      this.isGameReady = true;
      return;
    }

    this.socketProxy.setUsername(this.player.username);
  }

  closeAlert(): void {
    this.errorText = null;
  }

  //SOCKET CALLBACKS

  goBackCallback = () => {
    this.isGameReady = false;
  }

  usernameTaken = (data) => {
    this.errorText = data;
  }

  setUsername = () => {
    this.isGameReady = true;
  }
}
