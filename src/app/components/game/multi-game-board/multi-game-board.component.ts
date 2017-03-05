import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../../models/player';
import { Room } from '../../../models/room';
import { GameDifficulty, CardImages, Card } from '../../../models/game';
import { SocketProxyService } from '../../../services/socket-proxy.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'multi-game-board',
  templateUrl: './multi-game-board.component.html',
  styleUrls: ['./multi-game-board.component.css']
})
export class MultiGameBoardComponent implements OnInit {
  @Input()
  difficulty: string;
  @Input()
  player: Player;
  @Input()
  room: Room;
  @Input() 
  quitCallback: Function;

  remainingTime: number;
  playerOneRemainingMisses: number;
  playerTwoRemainingMisses: number;
  remainingMatches: number;

  gameCountdown: number;
  isCountingDown: boolean;
  isPlayerOne: boolean;
  isPlayerOneStart: boolean;
  isPlayerOneTurn: boolean;
  isGameStarted: boolean;
  isGameOver: boolean;
  playerOneScore: number;
  playerTwoScore: number;
  playerMoves: number;

  cards: Array<Array<Card>>;
  totalRows: number;
  gameCards: string[];

  isWinner: boolean;
  isLoser: boolean;
  isPlayerQuit: boolean;

  firstCard: Card;
  roundTime: number;

  isPlayerRestart: boolean;
  isOpponentRestart: boolean;
  restartWaitingText: string;

  constructor(private socketProxy: SocketProxyService, 
                private utils: UtilsService) { }

  ngOnInit() {
    this._setSocketCallbacks();

    this._setupGame();
    this._startGameCountdown();

    this.gameCards = CardImages.slice(0, this.remainingMatches);
    this.totalRows = (this.remainingMatches * 2) / 6;

    this.isPlayerOne = (this.player.username.toLowerCase() === this.room.player1);
    this.isPlayerOneTurn = true;
    this.isPlayerOneStart = true;

    if (this.isPlayerOne) {
      this._setupBoard();
    }
  }

  get isPlayerTurn() {
    return this.isPlayerOne ? this.isPlayerOneTurn : !this.isPlayerOneTurn;
  }

  get playerTurn(): string {
    return this.isPlayerOneTurn ? this.room.player1 : this.room.player2;
  }
  
  

  //TODO: Should probably split out this logic into two seperate functions for simplicity
  //      Currently proccesses both player and opponent moves.
  flipCard(card: Card, row?: number, col?: number) {
    if (!this.isPlayerTurn && row >= 0) {
      return;
    }
    
    if (card.isFlipped || this.playerMoves > 1 || !this.isGameStarted) {
      return;
    }

    if (this.isPlayerTurn) {
      var playerMove = {
        roomName: this.room.roomName, 
        row: row, 
        col: col
      };

      this.socketProxy.sendPlayerMove(playerMove);
    }
    
    card.isFlipped = true;
    this.playerMoves++;

    if (this.playerMoves === 2) {

      if (this.firstCard.id === card.id) {
        card.isMatched = true;
        this.firstCard.isMatched = true;
        this.playerMoves = 0;
        this.remainingMatches--;

        if (this.isPlayerOneTurn) {
          this.playerOneScore++;
          this.firstCard.playerOneMatched = true;
          card.playerOneMatched = true;
        } else {
          this.playerTwoScore++;
        }

        if (this.remainingMatches === 0) {
          if (this.isPlayerOne && this.playerOneScore > this.playerTwoScore) {
            this.isWinner = true;
          } else {
            this.isLoser = true;
          }

          this.isGameOver = true;
          return;
        }

      } else {
        this.isPlayerOneTurn ? this.playerOneRemainingMisses-- : this.playerTwoRemainingMisses--;

        setTimeout(() => {
          card.isFlipped = false;
          this.firstCard.isFlipped = false;
          this.playerMoves = 0;

          if (this.playerOneRemainingMisses === 0) {
            if (this.isPlayerOne) {
              this.isGameOver = true;
              this.isLoser = true;
            } else {
              this.isGameOver = true;
              this.isWinner = true;
            }
          } else if (this.playerTwoRemainingMisses === 0) {
            if (this.isPlayerOne) {
              this.isGameOver = true;
              this.isWinner = true;
            } else {
              this.isGameOver = true;
              this.isLoser = true;
            }
          } 
        }, 1000);
      }
      this.remainingTime = this.roundTime;
      this.isPlayerOneTurn = !this.isPlayerOneTurn;
      return;
    }
    this.remainingTime = this.roundTime;
    this.firstCard = card;
  }

  requestRestart() {
    this.isPlayerRestart = true;
    this.socketProxy.restartGame(this.room.roomName);

    if (this.isOpponentRestart) {
      this.isOpponentRestart = false;
      this.isPlayerOneStart = !this.isPlayerOneStart;
      this.isPlayerOneTurn = this.isPlayerOneStart;
      this._startGameCountdown();

      if (this.isPlayerTurn) {
        this._setupBoard();
      }

    } else {
      this.restartWaitingText = "Waiting for opponent to restart game...";
    }
  }

  quit() {
    this.socketProxy.quitGame(this.room.roomName);
    this.quitCallback();
  }

  //SOCKET CALLBACKS

  opponentRestart = () => {
    this.isOpponentRestart = true;
    
    if (this.isPlayerRestart) {
      this.isPlayerRestart = false;
      this.isPlayerOneStart = !this.isPlayerOneStart;
      this.isPlayerOneTurn = this.isPlayerOneStart;
      this._startGameCountdown();

      if (this.isPlayerTurn) {
        this._setupBoard();
      }
    } else {
      this.restartWaitingText = "Opponent waiting for you to restart game...";
    }
  }

  retreiveGameBoard = (room: Room) => {
    this.cards = room.gameCards;
  }

  retreivePlayerMove = (move: any) => {
    var selectedCard = this.cards[move.row][move.col];
    this.flipCard(selectedCard);
  }

  opponentQuit = () => {
    this.isWinner = true;
    this.isGameOver = true;
    this.isPlayerQuit = true;

    setTimeout(() => {
      this.quitCallback();
    }, 3000);
  }

  //PRIVATE METHODS

  private _setSocketCallbacks(): void {
    this.socketProxy.registerGetGameBoard(this.retreiveGameBoard);
    this.socketProxy.registerGetPlayerMove(this.retreivePlayerMove);
    this.socketProxy.registerPlayerQuit(this.opponentQuit);
    this.socketProxy.registerPlayerRestart(this.opponentRestart);
  }

   private _setupBoard(): void {
    this.cards = new Array<Array<Card>>(this.totalRows);

    for(var i = 0; i < this.totalRows; i++ ) {
      this.cards[i] = new Array<Card>(6);
    }

    //set first round of board images
    //split into 2 rounds for perceived better randomness
    this.gameCards.forEach((e, i) => {
      this._setBoardPiece(i, e);
    });

    this.gameCards.forEach((e, i) => {
      this._setBoardPiece(i, e);
    })

    this.room.gameCards = this.cards;
    this.socketProxy.sendGameBoard(this.room);
  }

  private _setBoardPiece(id, backSrc: string) {
    do {
      var cardFirstIndex = this.utils.GetRandomIntInclusive(0, this.totalRows - 1);
      var cardSecondIndex = this.utils.GetRandomIntInclusive(0, 5);
    } while(this.cards[cardFirstIndex][cardSecondIndex]) {
    }
    this.cards[cardFirstIndex][cardSecondIndex] = new Card(id, backSrc);
  }

  private _startGame() {
    this.isGameStarted = true;
    this.isGameOver = false;

    var roundInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime < 1) {
        this.isPlayerTurn ? this.isLoser = true : this.isWinner = true;
        this.isGameOver = true;
      }

      if (this.isGameOver) {
        this.isGameStarted = false;
        clearInterval(roundInterval);
      }
    }, 1000);
  }

  private _setupGame() {
    switch(GameDifficulty[this.difficulty]) {
      case GameDifficulty.Extreme:
        this.roundTime = 10;
        this.playerOneRemainingMisses = 7;
        this.playerTwoRemainingMisses = 7;
        this.remainingMatches = 21;
        break;
      case GameDifficulty.Hard:
        this.roundTime = 10;
        this.playerOneRemainingMisses = 8;
        this.playerTwoRemainingMisses = 8;
        this.remainingMatches = 15;
        break;
      case GameDifficulty.Medium:
        this.roundTime = 12;
        this.playerOneRemainingMisses = 10;
        this.playerTwoRemainingMisses = 10;
        this.remainingMatches = 9;
        break;
      case GameDifficulty.Easy:
      default:
        this.roundTime = 15;
        this.playerOneRemainingMisses = 10;
        this.playerTwoRemainingMisses = 10;
        this.remainingMatches = 9;
        break;
    }
  }

  private _startGameCountdown(): void {
    this.playerOneScore = 0;
    this.playerTwoScore = 0;
    this.gameCountdown = 3;
    this.isCountingDown = true;
    this.playerMoves = 0;
    this.isWinner = false;
    this.isLoser = false;
    this.remainingTime = this.roundTime;
    this.restartWaitingText = null;

    var countdownInterval = setInterval(() => {
      this.gameCountdown--

      if (this.gameCountdown === 0) {
        this.isCountingDown = false;
        this._startGame();
        clearTimeout(countdownInterval);
      }
    }, 1000)
  }

}
