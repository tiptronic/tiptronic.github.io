# Traccar via Docker Compose (SSH)

For those who prefer command-line control and easier configuration management.

## Prerequisites

- SSH access enabled on NAS
- Basic terminal knowledge

## Step 1: Connect via SSH

```bash
ssh admin@<nas-ip>
```

## Step 2: Create Directory Structure

```bash
sudo mkdir -p /volume1/docker/traccar/logs
sudo mkdir -p /volume1/docker/traccar/data
sudo mkdir -p /volume1/docker/traccar/conf
```

## Step 3: Create docker-compose.yml

Create `/volume1/docker/traccar/docker-compose.yml`:

```yaml
version: "3"
services:
  traccar:
    image: traccar/traccar:latest
    container_name: traccar
    hostname: traccar
    restart: unless-stopped
    ports:
      - "8082:8082"    # Web interface
      - "5055:5055"    # OwnTracks protocol
      - "5055:5055/udp"
    volumes:
      - /volume1/docker/traccar/logs:/opt/traccar/logs:rw
      - /volume1/docker/traccar/data:/opt/traccar/data:rw
      - /volume1/docker/traccar/conf/traccar.xml:/opt/traccar/conf/traccar.xml:ro
```

## Step 4: Create Configuration File

Create `/volume1/docker/traccar/conf/traccar.xml`:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>
<properties>
    <entry key="config.default">./conf/default.xml</entry>

    <!-- Database -->
    <entry key="database.driver">org.h2.Driver</entry>
    <entry key="database.url">jdbc:h2:./data/database</entry>
    <entry key="database.user">sa</entry>
    <entry key="database.password"></entry>

    <!-- Server -->
    <entry key="web.port">8082</entry>

    <!-- Enable OwnTracks protocol on port 5055 -->
    <entry key="owntracks.port">5055</entry>
</properties>
```

## Step 5: Start the Container

```bash
cd /volume1/docker/traccar
sudo docker-compose up -d
```

## Step 6: Verify

```bash
sudo docker ps | grep traccar
```

Then open `http://<nas-ip>:8082` in browser.

## Useful Commands

```bash
# View logs
sudo docker logs traccar

# Restart container
sudo docker-compose restart

# Stop container
sudo docker-compose down

# Update to latest image
sudo docker-compose pull
sudo docker-compose up -d
```

---

[Back to Installation Overview](#traccar/installation)
