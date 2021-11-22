import config from "./config.js";
import Fastify from "fastify";

const fastify = Fastify({
  logger: { level: config.get("logLevel") },
});

// Add sensible defaults
fastify.register(await import("fastify-sensible"));

// Add CORS handler
fastify.register(await import("fastify-cors"), {
  origin: "*",
  allowedHeaders: ["Authorization"],
  maxAge: 86400,
});

// Add file uploads handler
fastify.register(await import("fastify-multipart"), {
  limits: {
    fileSize: config.get("uploadMaxSize"),
  },
});

// Handle root route
fastify.register(await import("./routes/index.js"));

// Handle thumbnail creation route
fastify.register(await import("./routes/api/thumbnail.js"));

// Handle image proxy route
fastify.register(await import("./routes/api/proxy.js"));

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
