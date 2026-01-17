import { FastifyPluginAsync } from "fastify";
import { SampleService } from "../services/SampleService";

export const samplesRoutes = (sampleService: SampleService): FastifyPluginAsync => {
  const plugin: FastifyPluginAsync = async (app) => {
    app.post("/samples", async (request, reply) => {
      try {
        const body = request.body as any;
        const created = sampleService.create({
          name: body?.name,
          variants: body?.variants,
        });
        reply.code(201).send(created);
      } catch (err: any) {
        reply.code(400).send({ error: err.message ?? "Erro ao criar amostra" });
      }
    });

    app.get("/samples", async (_request, reply) => {
      reply.send(sampleService.list());
    });
  };

  return plugin;
};
