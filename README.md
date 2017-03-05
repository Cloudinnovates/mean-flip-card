## MeanFlipCard

This work is licensed with the MIT license. 

##App Details

A MEAN (MongoDB, ExpressJs, Angular 2, Node.Js) stack implementation of a memory card flip game

Some other technologies that will be used:
	Bootstrap
	Socket.IO
	Heroku
	Pixabay.com for images

Specs: 

	Players can play a single player game where they are playing against the clock and an amount of determined misses
	Players can also play against other players in real time
	Player lobby will list how many players are in the lobby while a player waits to join a game
	Card image locations will be chosen at random at the start of each game

Rules: 

	Single Player: 
		1. Easy/Medium/Hard/Extreme difficulty to determine the amount of time per turn, total amount of cards, and the amount of wrong choices they get
		2. Game ends if user runs out of time or user uses reaches their limit on wrong choices

	Multi Player: 
		1. Players are matched with an opponent 
		2. If no opponents are available, player will remain in lobby until next player joins
		3. First turn is determined by which user was first in the lobby
		4. Each player gets 2 chances per turn to try and match a card.
		5. Once a card has been matched, it will be highlighted by the color of the player who matched the card (black or red)
		6. Winner is determined by the player who made more matches at the end of the game
		7. Player will automatically lose if they run out of matches
		8. Player will automatically lose if they run out of time per turn

Ideas for Future Changes:

	1. Time per turn will consists of both a player's first and second turns (right now a player gets time for each individual turn)
	2. Running out of time per turn will only make a user lose a remaining miss and proceed to next player if playing multiplayer (currently causes the user to lose the game)
	3. If playing multiplayer, player continues their turn if they complete a match. This should alleviate instances where a player might be behind 1-2 matches during the final moves of the game but have no chance to win (currently turn is switched after every set of moves)
	4. Nice to have - Allow users to select custom images for game

Known Issues - Work In Progress: 
	The game table does not display in the center of the UI on mobile devices

##Run Locally
Install dependencies:

	npm install

Compile the Angular 2 typescript files & move the needed static files to /dist/ directory:

	npm run postinstall

Run the app (Runs Nodemon): 

	npm run dev
	navigate to http://localhost:3000

If you only want to run the application for UI purposes (Socket.IO will not run):

	ng serve

##Using Heroku
Use the official heroku.com documentation at https://devcenter.heroku.com/articles/nodejs

1. Install & Signup for Heroku (no credit card required).
2. Login:

	heroku login (you will need to enter credentials)

Create heroku app:

	cd to application root
	heroku create

GIT deploy of app: 

	git push heroku master

Open app: 

	heroku open


 
