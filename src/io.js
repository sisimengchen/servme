const io = require('socket.io')();
const users = [];
const sockets = {};
const pagemakerNS = io.of('/pagemaker');

const findIndex = function(arr, id) {
  let len = arr.length;

  while (len--) {
    if (arr[len].id === id) {
      return len;
    }
  }

  return -1;
};

pagemakerNS.on('connection', (socket) => {
  console.log('A user connected!', socket.id);

  let currentPlayer = {
    id: socket.id,
    hue: Math.round(Math.random() * 360),
    timestamp: +new Date()
  };

  socket.on('gotit', (player) => {
    console.log(`[INFO] Player ${player.name} connected!`);
    sockets[player.id] = socket;
    player.hue = Math.round(Math.random() * 360);
    currentPlayer = player;
    currentPlayer.timestamp = +new Date();
    users.push(currentPlayer);

    pagemakerNS.emit('playerJoin', { name: currentPlayer.name });
  });

  socket.on('pingcheck', () => {
    socket.emit('pongcheck');
  });

  socket.on('disconnect', () => {
    if (findIndex(users, currentPlayer.id) > -1) {
      users.splice(findIndex(users, currentPlayer.id), 1);
    }
    console.log(`[INFO] User ${currentPlayer.name} disconnected!`);

    socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
  });

  socket.on('pageEdit', (data) => {
    const _sender = data.sender.replace(/(<([^>]+)>)/gi, '');
    const _message = data.message.replace(/(<([^>]+)>)/gi, '');

    console.log(`[pageEdit] [${new Date().getHours()}:${new Date().getMinutes()}] ${_sender}: ${_message}`);

    socket.broadcast.emit('serverSendPageEdit', { sender: _sender, message: _message.substring(0, 35) });
  });
});

module.exports = io;
