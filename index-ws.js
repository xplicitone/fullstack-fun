const { count } = require('console');
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

process.on('SIGINT', () => {
  // go thru every websocket connection and close it
  wss.clients.forEach(function each(client) {
    client.close();
  });
  // then close server then shutdown db
  server.close(() => {
    shutdownDB();
  });
});

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

  // could wrap as function but do it here for now
  db.run(`INSERT INTO visitors (count, time)
          VALUES (${numClients}, datetime('now'))
  `);

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

/** end websockets */
/** begin database */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `)
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  
  console.log('Shutting down dee bee');
  getCounts();
  db.close();
}