import { FastifyPluginAsync } from "fastify";
import { SampleService } from "../services/SampleService";
import { ReportService } from "../services/ReportService";

export const reportsRoutes = (
  sampleService: SampleService,
  reportService: ReportService
): FastifyPluginAsync => {
  const plugin: FastifyPluginAsync = async (app) => {
    app.post("/reports/previa", async (request, reply) => {
      try {
        const body = request.body as any;
        const sampleId = body?.sampleId as string | undefined;
        const notes = body?.notes as string | undefined;

        if (!sampleId) {
          reply.code(400).send({ error: "sampleId é obrigatório." });
          return;
        }

        const sample = sampleService.getById(sampleId);
        if (!sample) {
          reply.code(404).send({ error: "Amostra não encontrada." });
          return;
        }

        const report = reportService.generate(sample, notes ?? "");
        reply.send(report);
      } catch (err: any) {
        reply.code(400).send({ error: err.message ?? "Erro ao gerar prévia" });
      }
    });

    app.post("/reports", async (request, reply) => {
      try {
        const body = request.body as any;
        const sampleId = body?.sampleId as string | undefined;
        const notes = body?.notes as string | undefined;

        if (!sampleId) {
          reply.code(400).send({ error: "sampleId é obrigatório." });
          return;
        }

        const sample = sampleService.getById(sampleId);
        if (!sample) {
          reply.code(404).send({ error: "Amostra não encontrada." });
          return;
        }

        const report = reportService.generate(sample, notes ?? "");
        reply.send(reportService.save(report));
      } catch (err: any) {
        reply.code(400).send({ error: err.message ?? "Erro ao gerar laudo" });
      }
    });

    app.get("/reports/:sampleId", async (request, reply) => {
      const { sampleId } = request.params as { sampleId: string };
      const report = reportService.get(sampleId);
      if (!report) {
        reply.code(404).send({ error: "Laudo não encontrado." });
        return;
      }
      reply.send(report);
    });
  };

  return plugin;
};
