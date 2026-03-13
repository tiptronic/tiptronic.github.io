# Traccar Configuration

Detailed configuration options for your Traccar server.

## traccar.xml Settings

The main configuration file is `/opt/traccar/conf/traccar.xml` (mounted from host).

### Database Options

#### H2 (Default - Embedded)

```xml
<entry key="database.driver">org.h2.Driver</entry>
<entry key="database.url">jdbc:h2:./data/database</entry>
<entry key="database.user">sa</entry>
<entry key="database.password"></entry>
```

#### MySQL/MariaDB (Production)

```xml
<entry key="database.driver">com.mysql.cj.jdbc.Driver</entry>
<entry key="database.url">jdbc:mysql://localhost:3306/traccar?serverTimezone=UTC&amp;allowPublicKeyRetrieval=true&amp;useSSL=false</entry>
<entry key="database.user">traccar</entry>
<entry key="database.password">your_password</entry>
```

### Protocol Ports

Enable only the protocols you need:

```xml
<!-- OwnTracks - primary for this project -->
<entry key="owntracks.port">5055</entry>

<!-- Other common protocols (optional) -->
<entry key="osmand.port">5056</entry>
<entry key="gps103.port">5001</entry>
```

### Port Conflicts on Synology

Be careful when enabling additional protocols. Some Traccar ports conflict with Synology services:

| Traccar Protocol | Default Port | Synology Conflict |
|------------------|--------------|-------------------|
| Web UI | 8082 | None - safe |
| OwnTracks | 5055 | None - safe |
| GPS103 | 5001 | **DSM HTTPS** |
| Osmand | 5056 | None - safe |

**Recommendation:** Stick with ports 8082 and 5055. If you need GPS103, change it to an unused port like 5101:

```xml
<entry key="gps103.port">5101</entry>
```

To check what ports are in use on your Synology:

```bash
netstat -tlnp | grep LISTEN
```

Or in DSM: **Control Panel → Security → Firewall → Edit Rules**

### Web Interface

```xml
<entry key="web.port">8082</entry>
<entry key="web.address">0.0.0.0</entry>
```

### Logging

```xml
<entry key="logger.level">info</entry>
<entry key="logger.file">./logs/tracker-server.log</entry>
```

### Registration

Control whether new users can register:

```xml
<entry key="registration.enable">true</entry>
```

## Device Configuration

### Adding Devices

1. Log into Traccar web interface
2. Go to Devices
3. Add new device with:
   - **Name**: e.g., "Bus 1"
   - **Identifier**: Unique ID (used by OwnTracks as `tid`)

### Device Attributes

Useful attributes:

- `speedLimit`: Alert if exceeded
- `deviceTimeout`: Time before marking offline

## User Management

### Admin Account

Created on first access to web interface.

### Driver Accounts

Create separate accounts for each driver with limited permissions.

## Geofences

Define areas for:

- Bus stops
- Route boundaries
- Depot location

## Notifications

Configure alerts for:

- Device online/offline
- Geofence enter/exit
- Speed limit exceeded

---

- [Back to Installation](#traccar/installation)
- [Integration Guide](#traccar/integration)
