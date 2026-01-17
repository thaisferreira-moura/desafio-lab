import fastify from "fastify";
import cors from "@fastify/cors";
import { SampleService } from "./services/SampleService";
import { ReportService } from "./services/ReportService";
import { samplesRoutes } from "./routes/samples";
import { reportsRoutes } from "./routes/reports";

const app = fastify({ logger: false });

async function main() {
  await app.register(cors, { origin: true });

  const sampleService = new SampleService();
  const reportService = new ReportService();

  app.get("/", async () => ({ status: "API running" }));

  await app.register(samplesRoutes(sampleService));
  await app.register(reportsRoutes(sampleService, reportService));

  const port = Number(process.env.PORT ?? 3333);
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`running on port ${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
