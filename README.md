# Image Resize Service

Simple and fast Node microservice to create image thumbnails.

Uses [`sharp`][npm-sharp] under the hood.

## Usage

- Clone repository
- `npm install`
- Copy `.env-example` to `.env` and edit variables
- `npm start`

Use pm2, systemd or any other method to run as a service.

## Development

- Use `npm run lint` to fix linting issues (or `npm run lint:check` to validate).
- Additional output could be enabled by changing `LOG_LEVEL` environment variable.

[npm-sharp]: https://www.npmjs.com/package/sharp
