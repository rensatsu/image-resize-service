require("dotenv").config();
const fs = require("fs-extra");
const convict = require("convict");
const convictFormatWithValidator = require("convict-format-with-validator");
convict.addFormats(convictFormatWithValidator);

convict.addFormat({
  name: "valid-dir",
  validate: async function (val, schema) {
    if (!val || !(typeof val === "string")) {
      throw new TypeError(`Invalid path (${schema.doc ?? ""})`);
    }

    await fs.ensureDirSync(val);
  },
});

// Config schema
const config = convict({
  logLevel: {
    doc: "Logging level",
    format: ["fatal", "error", "warn", "info", "debug", "trace"],
    default: "info",
    env: "LOG_LEVEL",
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
    default: 3000,
    env: "HTTP_PORT",
  },
  outputDir: {
    doc: "Directory for resized images",
    format: "valid-dir",
    env: "OUTPUT_DIR",
    default: null,
  },
  uploadMaxSize: {
    doc: "Max size of uploaded files (in bytes)",
    format: "nat",
    default: 10 * 1024 * 1024,
    env: "UPLOAD_MAX_SIZE",
  },
  thumbnail: {
    quality: {
      doc: "Thumbnail quality (0...100, higher is better)",
      format: "nat",
      default: 90,
      env: "THUMB_QUALITY",
    },
    reductionEffort: {
      doc: "Thumbnail reduction effort (0...6, 6 - lowest file size)",
      format: "nat",
      default: 4,
      env: "THUMB_REDUCTION",
    },
    width: {
      doc: "Thumbnail width",
      format: "nat",
      default: 640,
      env: "THUMB_WIDTH",
    },
    height: {
      doc: "Thumbnail height",
      format: "nat",
      default: 360,
      env: "THUMB_HEIGHT",
    },
  },
});

// Perform validation
config.validate({ allowed: "strict" });

module.exports = config;
