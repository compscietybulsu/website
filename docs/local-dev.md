# Local Development with Podman

This project supports local database containerization using **Podman** (per team convention; no Docker tooling).

We provide configurations across three buckets:
- `~c`: Podman Compose (`podman-compose.yml`)
- `~s`: systemd autostart service for compose
- `~q`: Native Podman Quadlet container units (`containers/quadlet/`)

---

## 1. Quick Start with Podman Compose (`~c`)

Start MongoDB and Mongo Express UI:

```bash
podman compose up -d
```

or with `podman-compose`:

```bash
podman-compose up -d
```

- **MongoDB connection string:** `mongodb://admin:devpassword@localhost:27017/compsciety?authSource=admin`
- **Mongo Express web UI:** [http://localhost:8081](http://localhost:8081)

To stop:

```bash
podman compose down
```

---

## 2. Autostart via systemd Service (`~s`)

To run the compose stack as a user-level background service:

```bash
mkdir -p ~/.config/systemd/user/
podman compose -f podman-compose.yml create
podman generate systemd --new --name compsciety-mongo --files --dest ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now container-compsciety-mongo.service
```

---

## 3. Native Podman Quadlet (`~q`)

For rootless Podman managed directly by systemd:

1. Copy Quadlet units:

```bash
mkdir -p ~/.config/containers/systemd/
cp containers/quadlet/compsciety-mongo.volume ~/.config/containers/systemd/
cp containers/quadlet/compsciety-mongo.container ~/.config/containers/systemd/
```

2. Reload systemd and start the container:

```bash
systemctl --user daemon-reload
systemctl --user start compsciety-mongo.service
```

3. Check status:

```bash
systemctl --user status compsciety-mongo.service
```

---

## Connecting Applications

In your `.env` or `server/.env`:

```env
MONGODB_URI=mongodb://admin:devpassword@localhost:27017/compsciety?authSource=admin
```
