# Traccar via Synology Container Manager

The easiest approach using DSM's built-in interface - no SSH required.

## Step 1: Download the Image

1. Open **Container Manager** in DSM
2. Go to **Registry**
3. Search for `traccar/traccar`
4. Select and click **Download**
5. Choose tag `latest`

## Step 2: Create Folders

Using File Station, create these folders:

```
/docker/traccar/
  ├── logs/
  ├── data/
  └── conf/
```

## Step 3: Create Configuration File

Create `traccar.xml` in `/docker/traccar/conf/`:

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>
<properties>
    <entry key="config.default">./conf/default.xml</entry>
    <entry key="database.driver">org.h2.Driver</entry>
    <entry key="database.url">jdbc:h2:./data/database</entry>
    <entry key="database.user">sa</entry>
    <entry key="database.password"></entry>
    <entry key="web.port">8082</entry>
    <entry key="owntracks.port">5055</entry>
</properties>
```

You can create this file using:
- **Text Editor** in DSM (install from Package Center if needed)
- Or create locally and upload via File Station

## Step 4: Create Container

1. Go to **Image** in Container Manager
2. Select `traccar/traccar` and click **Run**
3. Configure:

### General Settings

- Container name: `traccar`
- Enable auto-restart: Yes

### Port Settings

| Local Port | Container Port | Protocol |
|------------|----------------|----------|
| 8082 | 8082 | TCP |
| 5055 | 5055 | TCP |
| 5055 | 5055 | UDP |

### Volume Settings

| Local Folder | Container Path | Mode |
|--------------|----------------|------|
| /docker/traccar/logs | /opt/traccar/logs | rw |
| /docker/traccar/data | /opt/traccar/data | rw |
| /docker/traccar/conf/traccar.xml | /opt/traccar/conf/traccar.xml | ro |

4. Click **Done** to start the container

## Step 5: Verify

1. Go to **Container** in Container Manager
2. Check that `traccar` is running (green status)
3. Open `http://<nas-ip>:8082` in browser

---

[Back to Installation Overview](#traccar/installation)
