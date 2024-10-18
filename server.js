// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
