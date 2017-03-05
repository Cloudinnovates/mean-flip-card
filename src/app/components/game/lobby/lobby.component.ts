import { Component, OnInit, Input } from '@angular/core';

import { Game, GameDifficulty } from '../../../models/game';
import { Player } from '../../../models/player';
import { Room } from '../../../models/room';

import { SocketProxyService } from '../../../services/socket-proxy.service';

@Component({
  selector: 'game-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  @Input()
  difficulty: string;
  @Input()
  player: Player
  @Input()
  goBackCallback: Function

  lobbySize: number;
  waitingText: string;
  isGameJoined: boolean;
  gameRoom: Room;

  constructor(private socketProxy: SocketProxyService) { }

  ngOnInit() {
    this.waitingText = 'Waiting...';
    this.isGameJoined = false;

    this._registerSocketCallbacks();
    this.socketProxy.connectToLobby(this.difficulty);
  }

  goBack = () => {
    this.socketProxy.leaveRooms();
    this.goBackCallback();
  }

  updateLobbySize = (size: number) => {
    this.lobbySize = size;
  }

  roomCreated = (text: string) => {
    this.waitingText = text;
  }

  roomJoined = (room: Room) => {
    this.gameRoom = room;
    this.waitingText = "Joined Room!";
    this.isGameJoined = true;
  }

  //SOCKET CALLBACKS

  private _registerSocketCallbacks() {
    this.socketProxy.registerRoomCountUpdate(this.updateLobbySize);
    this.socketProxy.registerRoomCreated(this.roomCreated);
    this.socketProxy.registerRoomJoined(this.roomJoined);
  }

}
