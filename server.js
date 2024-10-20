// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

// API routes
let hosts = [
  { id: 1, name: 'Host 1', status: 'Online', vms: 12, containers: 5 },
  { id: 2, name: 'Host 2', status: 'Online', vms: 8, containers: 3 },
  { id: 3, name: 'Host 3', status: 'Offline', vms: 0, containers: 0 },
  { id: 4, name: 'Host 4', status: 'Online', vms: 15, containers: 7 },
];

app.get('/api/hosts', (req, res) => {
  res.json(hosts);
});

app.post('/api/hosts', (req, res) => {
  const newHost = { ...req.body, id: hosts.length + 1 };
  hosts.push(newHost);
  res.json(newHost);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// SSL configuration
const sslOptions = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

// Create HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// Redirect HTTP to HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80, () => {
  console.log('HTTP Server running on port 80');
});
