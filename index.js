var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http);
var static_files = require('./static_files');


users = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(static_files('/', __dirname));


io.on('connection', function (socket) {
    var userID = '';

    
    socket.on('new log in', function (user) {
        userID = user['name']
        if (users.indexOf(userID) != -1 || !userID) {
            userID += user['connectTime'];
        }
        users.push(userID);
        io.emit('connect message', userID);
        // send new user list
        io.emit('update user list', users);

        // test
        console.log(users);
    });

    

    socket.on('chat message', function (msg) {
        socket.broadcast.emit('chat message', `${userID}: ${msg}`);
    });

    socket.on('disconnect', function () {
        let user_index = users.indexOf(userID)
        if (user_index > -1) {
            users.splice(user_index, 1);
        }
        io.emit('disconnect message', userID);
        io.emit('update user list', users);
        console.log(`${userID} disconnected.`);
    });

    socket.on('status: not typing', function () {
        socket.broadcast.emit('status: not typing', userID);
    });

    socket.on('status: is typing', function () {
        socket.broadcast.emit('status: is typing', userID);
    });

});


http.listen(3000, function () {
    console.log('listening on *:3000');
});