/**
 * Register routes.
 *
 * @param {import("fastify").FastifyInstance} fastify Fastify Instance
 */
async function routes(fastify) {
  fastify.get("/", (_, reply) => {
    reply.notFound();
  });
}

export default routes;
