# Traccar Integration

How to connect Traccar with mobile apps and other systems.

## OwnTracks Integration

Traccar supports the OwnTracks protocol natively on port 5055.

### OwnTracks App Configuration

Configure OwnTracks app to send to Traccar:

```
Mode: HTTP
URL: http://<nas-ip>:5055
```

Or using the Traccar-specific endpoint:

```
URL: http://<nas-ip>:5055/?id=<device-identifier>
```

### Device Identifier Mapping

Each OwnTracks device needs a matching device in Traccar:

| OwnTracks TID | Traccar Device ID | Description |
|---------------|-------------------|-------------|
| B1 | bus1 | Bus 1 |
| B2 | bus2 | Bus 2 |

## Traccar REST API

### Authentication

```bash
curl -u admin:password http://<nas-ip>:8082/api/session
```

### Get Devices

```bash
curl -u admin:password http://<nas-ip>:8082/api/devices
```

### Get Positions

```bash
# Latest position for all devices
curl -u admin:password http://<nas-ip>:8082/api/positions

# Positions for specific device in time range
curl -u admin:password "http://<nas-ip>:8082/api/positions?deviceId=1&from=2024-01-01T00:00:00Z&to=2024-01-02T00:00:00Z"
```

### WebSocket for Real-time Updates

```javascript
const socket = new WebSocket('ws://<nas-ip>:8082/api/socket');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.positions) {
    // Handle position updates
    console.log('Position update:', data.positions);
  }
};
```

## Web Application Integration

### Fetching Bus Positions

```javascript
async function getBusPositions() {
  const response = await fetch('http://<nas-ip>:8082/api/positions', {
    headers: {
      'Authorization': 'Basic ' + btoa('user:password')
    }
  });
  return response.json();
}
```

### Displaying on Map

```javascript
// Update bus marker with Traccar position
function updateBusMarker(position) {
  const latlng = [position.latitude, position.longitude];
  busMarker.setLatLng(latlng);

  // Optional: show speed, heading
  busMarker.bindPopup(`
    Speed: ${position.speed} km/h
    Updated: ${new Date(position.fixTime).toLocaleString()}
  `);
}
```

## Data Flow

```
OwnTracks App (Phone)
        |
        v
   Traccar Server (Docker on NAS)
        |
        v
   REST API / WebSocket
        |
        v
   Web Application
```

## Comparison with Direct OwnTracks

| Feature | Direct OwnTracks | Via Traccar |
|---------|-----------------|-------------|
| Storage | External recorder | Built-in database |
| Multi-device | Manual setup | Built-in management |
| History | Depends on recorder | Native support |
| Web UI | None | Full admin interface |
| Geofencing | App-only | Server-side |

## Security Considerations

- Use HTTPS in production (reverse proxy)
- Strong passwords for API access
- Consider VPN for remote access
- Limit exposed ports

---

- [Back to Installation](#traccar/installation)
- [Configuration Guide](#traccar/configuration)
