require("dotenv").config();
const convict = require("convict");

// Config schema
const config = convict({
  env: {
    doc: "The application environment",
    format: ["production", "development"],
    default: "development",
    env: "NODE_ENV",
    arg: "env",
  },
  hostname: {
    doc: "The hostname or IP address to bind",
    format: "url",
    default: "localhost",
    env: "HTTP_HOST",
  },
  port: {
    doc: "The port to bind",
    format: "port",
    default: 7580,
    env: "HTTP_PORT",
  },
  uploadMaxSize: {
    doc: "Max size of uploaded files (in bytes)",
    format: Number,
    default: 10 * 1024 * 1024,
    env: "UPLOAD_MAX_SIZE",
  },
  thumbnail: {
    quality: {
      doc: "Thumbnail quality (0...100, higher is better)",
      format: Number,
      default: 90,
      env: "THUMB_QUALITY",
    },
    width: {
      doc: "Thumbnail width",
      format: Number,
      default: 640,
      env: "THUMB_WIDTH",
    },
    height: {
      doc: "Thumbnail height",
      format: Number,
      default: 360,
      env: "THUMB_HEIGHT",
    },
  },
});

// Perform validation
config.validate({ allowed: "strict" });

module.exports = config;
