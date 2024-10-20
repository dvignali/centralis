# backend/app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from proxmox_api import ProxmoxAPI

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://proxmox_user:your_password@localhost/proxmox_manager'
db = SQLAlchemy(app)

from models import Host, Cluster, TelemetryData

proxmox_api = ProxmoxAPI('https://your_proxmox_server:8006', 'root@pam', 'your_password')

@app.route('/api/hosts', methods=['GET'])
def get_hosts():
    hosts = Host.query.all()
    return jsonify([host.to_dict() for host in hosts])

@app.route('/api/clusters', methods=['GET'])
def get_clusters():
    clusters = Cluster.query.all()
    return jsonify([cluster.to_dict() for cluster in clusters])

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    host_id = request.args.get('host_id')
    telemetry = TelemetryData.query.filter_by(host_id=host_id).order_by(TelemetryData.timestamp.desc()).limit(100).all()
    return jsonify([t.to_dict() for t in telemetry])

@app.route('/api/cluster/start', methods=['POST'])
def start_cluster():
    cluster_id = request.json['cluster_id']
    # Implement cluster start logic using proxmox_api
    return jsonify({'message': 'Cluster start initiated'})

@app.route('/api/cluster/stop', methods=['POST'])
def stop_cluster():
    cluster_id = request.json['cluster_id']
    # Implement cluster stop logic using proxmox_api
    return jsonify({'message': 'Cluster stop initiated'})

if __name__ == '__main__':
    app.run(debug=True)
