var isTypingArea = $('#footer p');
var textarea = $('#m');
var lastTypedTime = new Date(0);
var typingDelayMillis = 2000;

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
