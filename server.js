const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

// THIS IS THE MAGIC LINE: It shares your index.html and images with the browser
app.use(express.static(__dirname));

let timeLeft = 600; // 10 minutes in seconds

// Game Timer Logic
setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    timeLeft = 600; // Reset to 10 mins
    io.emit('gameReset'); 
  }
  io.emit('timerUpdate', timeLeft);
}, 1000);

io.on('connection', (socket) => {
  console.log('A rat connected: ' + socket.id);

  // When a player moves, tell everyone else
  socket.on('playerUpdate', (data) => {
    socket.broadcast.emit('playerData', data);
  });

  socket.on('disconnect', () => {
    console.log('A rat disconnected');
    io.emit('playerLeave', socket.id);
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`RATZ SERVER IS LIVE!`);
  console.log(`Open your browser to: http://localhost:${PORT}`);
  console.log(`=================================`);
});