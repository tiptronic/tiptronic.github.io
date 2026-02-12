# Traccar Installation on Synology DS718+

This guide walks through installing Traccar GPS tracking server on a Synology NAS using Docker.

## Prerequisites

- Synology DS718+ (or similar model with Docker support)
- Docker / Container Manager package installed
- Available ports: 8082 (web), 5055 (OwnTracks protocol)

## Choose Your Method

### [Synology Container Manager (GUI)](docs.html?post=traccar/installation/container-manager)

Best for: Users who prefer the graphical interface

- No SSH required
- Point-and-click setup
- Easy to manage via DSM

### [Docker Compose via SSH](docs.html?post=traccar/installation/docker-compose)

Best for: Users comfortable with command line

- More control over configuration
- Easier to version control
- Simpler updates and backups

---

## Verifying Installation

### Web Interface

Open `http://<nas-ip>:8082` in your browser. If you see the login page, Traccar is running. Create your admin account on first access.

### Container Manager (GUI)

In DSM, open **Container Manager → Container** and check if `traccar` shows green/running status.

### SSH Commands

```bash
# Check container status
docker ps | grep traccar

# Check if ports are listening
netstat -tlnp | grep -E "8082|5055"

# View recent logs
docker logs traccar --tail 50

# Check container health
docker inspect traccar --format='{{.State.Status}}'
```

### Test OwnTracks Endpoint

```bash
curl -v http://localhost:5055
```

Even an error response means the port is listening and ready for connections.

## Network Considerations

### Port Forwarding (if accessing from internet)

| Service | Port | Protocol |
|---------|------|----------|
| Web UI | 8082 | TCP |
| OwnTracks | 5055 | TCP/UDP |

### Firewall

Ensure Synology firewall allows incoming connections on configured ports.

## Troubleshooting

### Check container status

In Container Manager, verify `traccar` shows green/running status.

### Check logs

```bash
docker logs traccar
```

### Check if ports are listening

```bash
netstat -tlnp | grep -E "8082|5055"
```

---

## Next Steps

- [Configuration](docs.html?post=traccar/configuration) - Database, protocols, and settings
- [Integration](docs.html?post=traccar/integration) - Connect with OwnTracks and other apps
