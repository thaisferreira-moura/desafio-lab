import { Report, ReportStatistics } from "../models/Report";
import { Sample } from "../models/Sample";

export class ReportService {
  private reports = new Map<string, Report>();

  generate(sample: Sample, notes: string): Report {
    const cleanNotes = notes?.trim();
    if (!cleanNotes) {
      throw new Error("notes é obrigatório.");
    }

    const statistics: ReportStatistics = {
      pathogenic: 0,
      benign: 0,
      vus: 0,
    };

    for (const v of sample.variants) {
      if (v.classification === "Patogênico") statistics.pathogenic++;
      if (v.classification === "Benigno") statistics.benign++;
      if (v.classification === "VUS") statistics.vus++;
    }

    const summary = `Foram encontradas ${sample.variants.length} variantes: ${statistics.pathogenic} Patogênica, ${statistics.benign} Benigna e ${statistics.vus} VUS.`;

    const highlightedVariants = sample.variants.filter(
      (v) => v.classification === "Patogênico"
    );

    return {
      sampleId: sample.id,
      summary,
      statistics,
      highlightedVariants,
      notes: cleanNotes,
      generatedAt: new Date().toISOString(),
    };
  }

  save(report: Report): Report {
    this.reports.set(report.sampleId, report);
    return report;
  }

  get(sampleId: string): Report | undefined {
    return this.reports.get(sampleId);
  }
}
