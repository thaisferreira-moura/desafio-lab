import { Variant } from "./Variant";

export interface ReportStatistics {
  pathogenic: number;
  benign: number;
  vus: number;
}

export interface Report {
  sampleId: string;
  summary: string;
  statistics: ReportStatistics;
  highlightedVariants: Variant[];
  notes: string;
  generatedAt: string;
}
