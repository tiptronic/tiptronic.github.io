# Traccar GPS Tracking on Synology

[Traccar](https://www.traccar.org/) is an open-source GPS tracking platform. This guide covers installing and configuring it on a Synology DS718+ NAS using Docker.

## Why Traccar?

- **Self-hosted** - Your location data stays on your own hardware
- **Open-source** - No subscription fees, full control
- **Multi-protocol** - Supports OwnTracks, OsmAnd, and 200+ GPS devices
- **Web interface** - Manage devices and view history from any browser

## Guides

- [Installation](docs.html?post=traccar/installation) - Docker setup options (GUI or SSH)
- [Configuration](docs.html?post=traccar/configuration) - Database, protocols, and settings
- [Integration](docs.html?post=traccar/integration) - Connect with OwnTracks and other apps

## Quick Reference

| Service | Port | Protocol |
|---------|------|----------|
| Web UI | 8082 | TCP |
| OwnTracks | 5055 | TCP/UDP |

## Resources

- [Traccar GitHub](https://github.com/traccar/traccar)
- [Traccar Documentation](https://www.traccar.org/documentation/)
- [OwnTracks App](https://owntracks.org/)
