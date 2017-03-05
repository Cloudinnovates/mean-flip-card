import { Component, OnInit, Input } from '@angular/core';
import { Card, GameDifficulty, CardImages } from '../../../models/game';
import { Player } from '../../../models/player';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  @Input()
  difficulty: string;
  @Input()
  goBackCallback: Function;
  @Input()
  player: Player

  cards: Array<Array<Card>>;
  cardImages: Array<string>;
  playerTurn: number;
  
  firstTurn: Card;
  roundLength: number;
  totalPairs: number;
  missesAllowed: number;
  remainingTime: number;
  remainingMisses: number;
  remainingMatches: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  isWinner: boolean;
  isLoser: boolean;
  totalRows: number;

  constructor(private utils: UtilsService) { }

  ngOnInit() {
    this._setupGame();
    this.cardImages = CardImages.slice(0, this.totalPairs);
    this.totalRows = (this.totalPairs * 2) / 6;
    this._resetBoard();
  }

  

  setBoardPiece(id, backSrc: string) {
    do {
      var cardFirstIndex = this.utils.GetRandomIntInclusive(0, this.totalRows - 1);
      var cardSecondIndex = this.utils.GetRandomIntInclusive(0, 5);
    } while(this.cards[cardFirstIndex][cardSecondIndex]) {
    }
    this.cards[cardFirstIndex][cardSecondIndex] = new Card(id, backSrc);
  }

  startGame() {
    if(this.isGameStarted) {
      return;
    }
    this.isGameStarted = true;
    this.isGameOver = false;

    var roundInterval = setInterval(() => {
    this.remainingTime--;

    if (this.remainingTime < 1) {
      this.isLoser = true;
      this.isGameOver = true;
    }

    if (this.isGameOver) {
      this.isGameStarted = false;
      clearInterval(roundInterval);
    } 
    }, 1000)
  }

  resetGame() {
    this._resetBoard();
    this.startGame();
  }

  flipCard(card: Card) {
    if (card.isFlipped || this.playerTurn > 1 || !this.isGameStarted) {
      return;
    }

    card.isFlipped = true;
    this.playerTurn++;

    
    if (this.playerTurn === 2) {
      if (this.firstTurn.id === card.id) {
        card.isMatched = true;
        this.firstTurn.isMatched = true;
        this.playerTurn = 0;
        this.remainingMatches--;
        
        if (this.remainingMatches === 0) {
          this.isGameOver = true;
          this.isWinner = true;
          return;
        }

      } else {
        setTimeout(() => {
          card.isFlipped = false;
          this.firstTurn.isFlipped = false;
          this.playerTurn = 0;
          this.remainingMisses--;

          if (this.remainingMisses === 0) {
          this.isGameOver = true;
          this.isLoser = true;
          }  
        }, 1000);
      }
      this.remainingTime = this.roundLength;
      return;
    }
    this.remainingTime = this.roundLength;
    this.firstTurn = card;
  }

  goBack() {
    this.goBackCallback();
  }

  //PRIVATE METHODS
  private _setupGame() {
    switch(GameDifficulty[this.difficulty]) {
      case GameDifficulty.Easy:
        this.totalPairs = 9;
        this.roundLength = 15;
        this.missesAllowed = 12;
      break;
      case GameDifficulty.Medium:
        this.totalPairs = 9;
        this.roundLength = 15;
        this.missesAllowed = 10;
        break;
      case GameDifficulty.Hard: 
        this.totalPairs = 15;
        this.roundLength = 10;
        this.missesAllowed = 8;
        break;
      case GameDifficulty.Extreme: 
        this.totalPairs = 21;
        this.roundLength = 8;
        this.missesAllowed = 7;
    }
  }

  private _resetBoard() {
    this.playerTurn = 0;
    this.cards = new Array<Array<Card>>(this.totalRows);
    this.remainingTime = this.roundLength;
    this.remainingMisses = this.missesAllowed;
    this.remainingMatches = this.totalPairs;
    this.isWinner = false;
    this.isLoser = false;
    
    for(var i = 0; i < this.totalRows; i++ ) {
      this.cards[i] = new Array<Card>(6);
    }
    
    //set first round of board images
    //split into 2 rounds for perceived better randomness
    this.cardImages.forEach((e, i) => {
      this.setBoardPiece(i, e);
    });

    this.cardImages.forEach((e, i) => {
      this.setBoardPiece(i, e);
    })
  }
}
