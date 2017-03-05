export class Game {
    type: GameType;
    difficulty: GameDifficulty;
    cards: GameCard[];

    constructor() {
        this.type = GameType.SinglePlayer;
        this.difficulty = GameDifficulty.Medium;
        this.cards = new Array<GameCard>();
    }
}

export enum GameType {
    SinglePlayer,
    MultiPlayer
}

export enum GameDifficulty {
    Easy, 
    Medium, 
    Hard, 
    Extreme
}

export class GameCard {
    imageUrl: string;
    isFlipped: boolean;
}

export class Card {
    id: number;
    frontSrc: string; 
    backSrc: string; 
    isFlipped: boolean;
    isMatched: boolean;
    playerOneMatched: boolean;

    constructor(id: number, backSrc: string) {
        this.id = id;
        this.backSrc = backSrc;
        this.frontSrc = '/images/background.jpg';
    }
}

export const CardImages: string[] = [
    "/images/frog-king.png",
    "/images/knight.png",
    "/images/bee.png",
    "/images/billiard.png",
    "/images/bird.png",
    "/images/hippo.png",
    "/images/mouse.png",
    "/images/dog.png",
    "/images/elephant.png",
    "/images/lion.png",
    "/images/lobster.png",
    "/images/monkey.png",
    "/images/penguin.png",
    "/images/popcorn.png",
    "/images/queen.jpg",
    "/images/reaper.png",
    "/images/sheep.png",
    "/images/teddy.png",
    "/images/panther.jpg",
    "/images/gator.png",
    "/images/gnome.png",
];