import config from "../../config.js";
import { default as fetch, Headers } from "node-fetch";
import { FastifySchema, FastifyInstance } from "fastify";

/** @type {FastifySchema} Proxy Validation Schema */
const proxySchema = {
  query: {
    type: "object",
    required: ["url"],
    properties: {
      url: { type: "string", format: "uri" },
      referer: { type: "string", format: "uri" },
    },
  },
};

/**
 * Download file.
 * @param {string} url URL.
 * @param {string|null} referer Referer header, use null for automatic detection.
 */
async function downloadFile(url, referer = null) {
  const dlHeaders = new Headers();

  dlHeaders.append("user-agent", config.get("userAgent"));

  // determine referer from url if custom referer is not defined
  if (referer === null) {
    const refUrl = new URL(url);
    referer = refUrl.origin;
  }

  // if referer is defined, add referer header
  // (don't attach as "else" to the previous "if")
  if (referer !== null) {
    dlHeaders.set("referer", referer);
  }

  const request = {
    method: "GET",
    headers: dlHeaders,
  };

  return await fetch(url, request);
}

/**
 * Register routes.
 *
 * @param {FastifyInstance} fastify Fastify Instance
 */
async function routes(fastify) {
  fastify.get("/api/proxy", { schema: proxySchema }, async (req, reply) => {
    const { url, referer } = req.query;
    const response = await downloadFile(url, referer);

    if (!response.ok) {
      throw new Error("Unable to download an image");
    }

    const type = response.headers.get("content-type");
    const size = response.headers.get("content-length");

    reply.code(200);
    if (type) reply.header("content-type", type);
    if (size) reply.header("content-length", size);
    reply.send(response.body);
  });
}

export default routes;
