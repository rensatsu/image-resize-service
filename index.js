const fastify = require("fastify")({ logger: { level: "debug" } });
const sharp = require("sharp");
const config = require("./config.js");

fastify.register(require("fastify-multipart"), {
  limits: {
    fileSize: config.get("uploadMaxSize"),
  },
});

fastify.post("/api/thumbnail", async (req, reply) => {
  const files = await req.saveRequestFiles();

  if (files.length !== 1) {
    throw new Error("There should be 1 image");
  }

  fastify.log.debug(`Temp file path: ${files[0].filepath}`);

  const thumb = await sharp(files[0].filepath)
    .resize(500, 450, {
      fit: sharp.fit.cover,
      position: sharp.gravity.north,
    })
    .webp({
      quality: 90,
      smartSubsample: true,
      force: true,
    })
    .toBuffer();

  reply.code(200).header("content-type", "image/webp").send(thumb);
});

const start = async () => {
  try {
    const host = config.get("hostname");
    const port = config.get("port");

    fastify.log.debug(`Hostname: ${host}`);
    fastify.log.debug(`Port: ${port}`);
    fastify.log.debug(`Uplaod max size: ${config.get("uploadMaxSize")}`);

    await fastify.listen(port, host);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
