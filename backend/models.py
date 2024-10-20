# backend/models.py
from app import db

class Host(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    cluster_id = db.Column(db.Integer, db.ForeignKey('cluster.id'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'cluster_id': self.cluster_id
        }

class Cluster(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    hosts = db.relationship('Host', backref='cluster', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'hosts': [host.to_dict() for host in self.hosts]
        }

class TelemetryData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer, db.ForeignKey('host.id'), nullable=False)
    cpu_usage = db.Column(db.Float)
    memory_usage = db.Column(db.Float)
    disk_usage = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'host_id': self.host_id,
            'cpu_usage': self.cpu_usage,
            'memory_usage': self.memory_usage,
            'disk_usage': self.disk_usage,
            'timestamp': self.timestamp.isoformat()
        }
