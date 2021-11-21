const config = require("./config.js");
const fastify = require("fastify")({
  logger: { level: config.get("logLevel") },
});
const sharp = require("sharp");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs-extra");

// Add file uploads handler
fastify.register(require("fastify-multipart"), {
  limits: {
    fileSize: config.get("uploadMaxSize"),
  },
});

// Handle thumbnail creation route
fastify.post("/api/thumbnail", async (req, reply) => {
  const files = await req.saveRequestFiles();

  if (files.length !== 1) {
    throw new Error("There should be 1 image");
  }

  fastify.log.debug(`Temp file path: ${files[0].filepath}`);

  // Temporary output file
  const reqId = crypto.randomUUID();
  const outputFile = path.join(config.get("outputDir"), `${reqId}.webp`);
  fastify.log.debug(`Output file path: ${outputFile}`);

  await sharp(files[0].filepath)
    .resize(config.get("thumbnail.width"), config.get("thumbnail.height"), {
      fit: sharp.fit.cover,
      position: sharp.gravity.north,
    })
    .webp({
      quality: config.get("thumbnail.quality"),
      smartSubsample: true,
      force: true,
      reductionEffort: config.get("thumbnail.reductionEffort"),
    })
    .toFile(outputFile);

  // Reading output file
  const outputFileStream = fs.createReadStream(outputFile);

  // Sending file
  await reply
    .code(200)
    .header("content-type", "image/webp")
    .send(outputFileStream);

  // Removing temporary file
  await fs.remove(outputFile);
});

/**
 * Start web server.
 */
async function start() {
  try {
    const host = config.get("hostname");
    const port = config.get("port");

    fastify.log.debug(`Loaded config ${config}`);

    await fastify.listen(port, host);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
