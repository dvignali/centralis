// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ClusterOperations from './components/ClusterOperations';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/cluster/:id" component={ClusterOperations} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography } from '@material-ui/core';
import TelemetryChart from './TelemetryChart';

function Dashboard() {
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    const response = await axios.get('/api/clusters');
    setClusters(response.data);
  };

  return (
    <div className="Dashboard">
      <Typography variant="h4">Proxmox VE Dashboard</Typography>
      <Grid container spacing={3}>
        {clusters.map(cluster => (
          <Grid item xs={12} md={6} key={cluster.id}>
            <Paper>
              <Typography variant="h6">{cluster.name}</Typography>
              {cluster.hosts.map(host => (
                <TelemetryChart key={host.id} hostId={host.id} />
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Dashboard;

// src/components/TelemetryChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function TelemetryChart({ hostId }) {
  const [telemetryData, setTelemetryData] = useState([]);

  useEffect(() => {
    fetchTelemetryData();
    const interval = setInterval(fetchTelemetryData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [hostId]);

  const fetchTelemetryData = async () => {
    const response = await axios.get(`/api/telemetry?host_id=${hostId}`);
    setTelemetryData(response.data);
  };

  return (
    <LineChart width={500} height={300} data={telemetryData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="cpu_usage" stroke="#8884d8" />
      <Line type="monotone" dataKey="memory_usage" stroke="#82ca9d" />
      <Line type="monotone" dataKey="disk_usage" stroke="#ffc658" />
    </LineChart>
  );
}

export default TelemetryChart;

// src/components/ClusterOperations.js
import React from 'react';
import axios from 'axios';
import { Button, Typography } from '@material-ui/core';

function ClusterOperations({ match }) {
  const clusterId = match.params.id;

  const startCluster = async () => {
    await axios.post('/api/cluster/start', { cluster_id: clusterId });
    alert('Cluster start initiated');
  };

  const stopCluster = async () => {
    await axios.post('/api/cluster/stop', { cluster_id: clusterId });
    alert('Cluster stop initiated');
  };

  return (
    <div className="ClusterOperations">
      <Typography variant="h5">Cluster Operations</Typography>
      <Button variant="contained" color="primary" onClick={startCluster}>Start Cluster</Button>
      <Button variant="contained" color="secondary" onClick={stopCluster}>Stop Cluster</Button>
    </div>
  );
}

export default ClusterOperations;
