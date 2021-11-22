import config from "../../config.js";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";
import fs from "fs-extra";

/**
 * Register routes.
 *
 * @param {import("fastify").FastifyInstance} fastify Fastify Instance
 */
async function routes(fastify) {
  fastify.post("/api/thumbnail", async (req, reply) => {
    const files = await req.saveRequestFiles();

    if (files.length !== 1) {
      return reply.badRequest("There should be 1 image");
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
}

export default routes;
