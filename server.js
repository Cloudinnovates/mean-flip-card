var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

app.use(bodyParser.json());

//Link to Angular build directory
var distDir = __dirname + '/dist/';
app.use(express.static(distDir));

// angular 2 spa routing catch-all
// angular 2 will handle 404 errors
app.get('*', function(req, res) {
    res.sendFile(distDir + 'index.html');
});

//store users in a dictionary
var users = {};

io.on('connection', function(socket) {
    console.log('A user connected');

    socket.on('disconnect', function() {
        console.log('A user disconnected');
        delete users[socket.id];
    });

    socket.on('setUsername', function(data) {
        var existingUser = findValue(users, data.toLowerCase());
        
        if (existingUser) {
            if (existingUser === socket.id) {
                socket.emit('usernameSet');
            } else {
                socket.emit('usernameTaken', `${data} username is taken. Try another username`);
            }
        } else {
            users[socket.id] = data.toLowerCase();
            socket.emit('usernameSet');
        }
    });

    socket.on('connectToLobby', function(difficulty) {
        socket.join(`Lobby-${difficulty}`);
        io.sockets.in(`Lobby-${difficulty}`).emit('newUserInRoom', io.nsps['/'].adapter.rooms[`Lobby-${difficulty}`].length);

        var rooms = io.nsps['/'].adapter.rooms;

        var availableRooms = Object.keys(rooms).filter((x) => x.indexOf(difficulty) === 0);
        
        var joinedRoom = "";
        for (var i = 0; i < availableRooms.length; i++) {
            var room = rooms[availableRooms[i]];
            
            if (room.length < 2) {
                joinedRoom = availableRooms[i];
                socket.join(joinedRoom);
                break;
            }
        }
        
        if (joinedRoom.length === 0) {
            var createdRoom = `${difficulty}-${users[socket.id]}`;
            socket.join(createdRoom);
            //emit created room
            io.sockets.in(createdRoom).emit('roomCreated', 'A room has been created. Waiting for a user to join...');
        } else {
            //emit joined room
            var roomDetails = {
                player1: joinedRoom.split('-')[1], 
                player2: users[socket.id], 
                roomName: joinedRoom
            }
            io.sockets.in(joinedRoom).emit('roomJoined', roomDetails);
        }
    });

    socket.on('leaveRooms', function() {
        socket.leaveAll();
    });

    socket.on('sendGameBoard', function(data) {
        socket.broadcast.to(data.roomName).emit('getGameBoard', data);
    });

    socket.on('sendPlayerMove', function(data) {
        socket.broadcast.to(data.roomName).emit('getPlayerMove', data);
    });

    socket.on('quitGame', function(data) {
        socket.broadcast.to(data).emit('playerQuit');
    });

    socket.on('restartGame', function(data) {
        socket.broadcast.to(data).emit('playerRestart');
    })
})

server.listen(port, function() {
    console.log("App now running on port", port);
});

function findValue(object, value) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop) && object[prop] === value) {
            return prop;
        }
    }
    return null;
}