# Image Resize Service

Simple and fast Node microservice to create image thumbnails.

Uses [`sharp`][npm-sharp] under the hood.

## Usage

- Clone repository
- `npm install`
- Copy `.env-example` to `.env` and edit variables
- `npm start`

## Automatic startup

Use pm2, systemd or any other method to run as a service.

Create a new systemd unit in `/etc/systemd/system/image-resize-service.service`:

```ini
[Unit]
Description=Image Resize Service
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/apps/image-resize-service
ExecStart=/usr/bin/node /var/www/apps/image-resize-service/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

## Development

- Use `npm run lint` to fix linting issues (or `npm run lint:check` to validate).
- Additional output could be enabled by changing `LOG_LEVEL` environment variable.

[npm-sharp]: https://www.npmjs.com/package/sharp
