var socket = io();
var textarea = $('#m');
var isTypingArea = $('#footer p');
var lastTypedTime = new Date(0);
var typingDelayMillis = 2000;

var user = {
    'name': '',
    'connectTime': '',
}

var user_list = new Vue({
    el: '#user-online',
    data:{
        users: []
    } 
});

// {user} is typing functionality
function refreshTypingStatus() {
    if (!textarea.is(':focus') || textarea.val() === '' || new Date().getTime() - lastTypedTime.getTime() >
        typingDelayMillis) {
        socket.emit('status: not typing');
    } else {
        socket.emit('status: is typing');
    }
}

function updateLastTypedTime() {
    lastTypedTime = new Date();
}

setInterval(refreshTypingStatus, 300);
textarea.keypress(updateLastTypedTime);
textarea.blur(updateLastTypedTime);

// send msgs
$('form').submit(function () {
    let msg = textarea.val();
    socket.emit('chat message', msg);
    textarea.val('');
    // append sent msg to my own window
    $('#messages').append($('<li>').text(`me: ${msg}`));

    return false;
});

// user is typing
socket.on('status: is typing', function (userID) {
    isTypingArea.show();
    isTypingArea.text(`${userID} is typing...`);
    console.log(`${userID} is typing...`)
});

// user stop typping
socket.on('status: not typing', function (userID) {
    isTypingArea.hide();
    isTypingArea.text('');
});


// create user profile
user.name = prompt("Please enter your name", "");
var date = new Date();
user.connectTime = date.getTime().toString();
socket.emit('new log in', user);

// get chat message
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

socket.on('connect message', function (userID) {
    $('#messages').append($('<li>').text(`${userID} connected.`));
});

socket.on('disconnect message', function (userID) {
    $('#messages').append($('<li>').text(`${userID} disconnected.`));
});

socket.on('update user list', function (users) {
    user_list.users = users
});