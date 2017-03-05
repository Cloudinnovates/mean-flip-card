# MeanFlipCard

A MEAN (MongoDB, ExpressJs, Angular 2, Node.Js) stack implementation of a card flip game

Some other technologies that will be used
	-Bootstrap
	-Socket.IO
	-Heroku to deploy

Specs: 

Players can play a single player game where they are playing against the clock and a certain amount of 'lives'
Players can also play against other players in real time
Card images will be chosen at random, however users can upload images if they want for the cards
Display total amount of users connected

Rules: 

	Single Player: 
		-Easy/Medium/Hard difficulty to determine the amount of time per turn, total amount of cards, and the amount of wrong choices they get
		-Game ends if user runs out of time or user uses reaches their limit on wrong choices

	Multi Player: 
		-Players are matched with an opponent, if no other opponents available, then will notify user to try again later or play alone
		-First turn is determined through a mini game
			-Guess the number - both users guess a number between 1 and 10. user who is closest to the random number is awarded first turn. if number is in middle, then low number wins
		-3 Rounds
		-Round ends when either one of the players runs out of time (other player wins) or when all the cards are flipped over
		-Round 3 tie breakers include
			1. Player with less total moves goes first
			2. Player with less total time goes first
			2. If both players have the same amount of moves and total time, goes to the mini game again. This time the opposite player who went first in the first minigame goes first
 
