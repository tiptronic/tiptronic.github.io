# Portainer on Synology: Is It Worth It?

When running Docker on a Synology NAS, you have two main options for container management: the built-in **Container Manager** or **Portainer**. Here's how they compare.

## What is Portainer?

[Portainer](https://www.portainer.io/) is an open-source web UI for managing Docker environments. It runs as a container itself and provides a more feature-rich interface than most built-in solutions.

## Comparison

| Feature | Container Manager | Portainer |
|---------|------------------|-----------|
| Installation | Built-in | Extra container |
| DSM Integration | Native | None |
| Log Viewing | Basic | Advanced (search, filters) |
| Container Shell | No | Yes (web terminal) |
| Stack/Compose | Limited | Full support |
| Templates | No | Yes (app library) |
| Multi-host | No | Yes |
| Resource Usage | None | ~20MB RAM |
| Learning Curve | Low | Low-Medium |

## When Portainer Helps

- **Multiple containers** - easier to manage 5+ services
- **Frequent deployments** - stack templates save time
- **Debugging** - quick shell access and log search
- **Docker Compose users** - better stack management
- **Learning Docker** - visual representation of concepts

## When to Skip Portainer

- **Few containers** - only running 1-3 services
- **SSH preference** - comfortable with command line
- **Minimal setup** - fewer moving parts to maintain
- **Resource constrained** - every MB counts

## My Recommendation

For a typical home server running a handful of services (Traccar, maybe a few more later):

**Start without Portainer.** Use Container Manager or SSH with docker-compose. It's simpler and you'll learn Docker fundamentals.

**Add Portainer later** if you find yourself:
- SSH-ing in frequently just to check logs
- Managing more than 5-6 containers
- Wanting to experiment with new services quickly

## Quick Install (If You Want It)

### Via Container Manager

1. Download `portainer/portainer-ce` from Registry
2. Create folder `/docker/portainer`
3. Create container with:
   - Port: 9000 → 9000
   - Volume: `/docker/portainer` → `/data`
   - Volume: `/var/run/docker.sock` → `/var/run/docker.sock`

### Via SSH

```bash
docker run -d \
  --name portainer \
  --restart unless-stopped \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /volume1/docker/portainer:/data \
  portainer/portainer-ce
```

Access at `http://<nas-ip>:9000`

## Resources

- [Portainer Documentation](https://docs.portainer.io/)
- [Portainer GitHub](https://github.com/portainer/portainer)
