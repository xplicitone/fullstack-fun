const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname});
});

// make server respond to our requests via express server app via http server
server.on('request', app);
server.listen(3000, function () {
  console.log('Listening on 3000');
});

/** Begin websocket */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({server: server});

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;
  console.log('Clients connected', numClients);

  wss.broadcast(`Current visitors ${numClients}`);

  // can get super creative here but simple for now
  // 3 states for checking errors
  // ws has state for every connection, pull from that enum
  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to my dope server, yo');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors ${numClients}`);
    console.log('See ya client, would not wanna be ya');
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
}