import { Injectable } from '@angular/core';
import { Room } from '../models/room';

import * as io from 'socket.io-client';

@Injectable()
export class SocketProxyService {
  socket: any;

  constructor() { }

  connect(): void {
    this.socket = io();
  }

  //Events

  setUsername(username: string): void {
    this.socket.emit('setUsername', username);
  }

  connectToLobby(difficulty: string): void {
    this.socket.emit('connectToLobby', difficulty);
  }

  leaveRooms(): void {
    this.socket.emit('leaveRooms');
  }

  sendGameBoard(roomDetails: Room): void {
    this.socket.emit('sendGameBoard', roomDetails);
  }

  sendPlayerMove(moveDetails: any): void {
    this.socket.emit('sendPlayerMove', moveDetails); 
  }

  quitGame(gameRoom: string): void {
    this.socket.emit('quitGame', gameRoom);
  }

  restartGame(gameRoom: string): void {
    this.socket.emit('restartGame', gameRoom);
  }

  //Callbacks

  registerUsernameSet(callback: Function): void {
    this.socket.on('usernameSet', function(data) {
      callback(data);
    })
  }

  registerUsernameTaken(callback: Function): void {
    this.socket.on('usernameTaken', function(data) {
      callback(data);
    });
  }

  registerRoomCountUpdate(callback: Function): void {
    this.socket.on('newUserInRoom', function(data) {
      callback(data);
    });
  }

  registerRoomCreated(callback: Function): void {
    this.socket.on('roomCreated', function(data) {
      callback(data);
    });
  }

  registerRoomJoined(callback: Function): void {
    this.socket.on('roomJoined', function(data) {
      callback(data);
    });
  }

  registerGetGameBoard(callback: Function): void {
    this.socket.on('getGameBoard', function(data) {
      callback(data);
    });
  }

  registerGetPlayerMove(callback: Function): void {
    this.socket.on('getPlayerMove', function(data) {
      callback(data);
    });
  }

  registerPlayerQuit(callback: Function): void {
    this.socket.on('playerQuit', function(data) {
      callback(data);
    });
  }

  registerPlayerRestart(callback: Function): void {
    this.socket.on('playerRestart', function(data) {
      callback(data);
    });
  }
}
